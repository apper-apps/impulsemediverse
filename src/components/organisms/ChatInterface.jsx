import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ChatMessage from "@/components/molecules/ChatMessage";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { consultationService } from "@/services/api/consultationService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ChatInterface = ({ departmentId, departmentName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

useEffect(() => {
    // Load initial greeting message with symptom checker introduction
    const greeting = {
      id: Date.now(),
      message: `Hello! I'm your AI ${departmentName} assistant. I'm here to help you with your health concerns and can guide you through a comprehensive symptom assessment. 

I can help you:
• Check your symptoms through guided questions
• Provide health recommendations based on your concerns
• Suggest when to seek medical attention
• Answer general health questions

Please describe your symptoms or health concerns, and I'll guide you through a personalized assessment. How can I assist you today?`,
      isAi: true,
      timestamp: new Date().toISOString(),
      department: departmentName
    };
    setMessages([greeting]);
  }, [departmentName]);

const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage,
      isAi: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response with symptom checker analysis
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = {
        id: Date.now() + 1,
        message: generateAIResponse(inputMessage, departmentName, messages),
        isAi: true,
        timestamp: new Date().toISOString(),
        department: departmentName
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

const generateAIResponse = (userMessage, department, conversationHistory) => {
    const lowerMessage = userMessage.toLowerCase();
    const isSymptomQuery = detectSymptomKeywords(lowerMessage);
    const conversationLength = conversationHistory.length;
    
    if (isSymptomQuery || conversationLength > 2) {
      return generateSymptomCheckerResponse(userMessage, department, conversationHistory);
    }
    
    const responses = {
      "General Practitioner": [
        "Based on your symptoms, I'd recommend monitoring your condition closely. Can you provide more details about when these symptoms started?",
        "I understand your concern. Let me help you assess this situation. Have you experienced any similar symptoms before?",
        "Thank you for sharing that information. Based on what you've described, here are some initial recommendations..."
      ],
      "Cardiologist": [
        "Cardiovascular health is crucial. Based on your description, I'd like to know more about your family history and lifestyle factors.",
        "Heart-related symptoms should always be taken seriously. Can you describe the frequency and intensity of what you're experiencing?",
        "I'm here to help with your cardiac concerns. Let's discuss your current medications and any recent changes in your health."
      ],
      "Neurologist": [
        "Neurological symptoms can be complex. Let me help you understand what might be happening. When did you first notice these changes?",
        "I appreciate you sharing your concerns. Neurological conditions require careful evaluation. Can you describe the pattern of your symptoms?",
        "Thank you for the detailed information. Based on neurological assessment principles, here's what I recommend..."
      ],
      "Psychologist": [
        "Mental health is just as important as physical health. I'm here to listen and support you. How have you been feeling lately?",
        "I understand this can be challenging. Let's work together to address your concerns. Can you tell me more about your current situation?",
        "Thank you for trusting me with your feelings. Mental wellness is a journey, and I'm here to help guide you through it."
      ],
      "General Nurse": [
        "I'm here to help with your general health questions and provide guidance on wellness practices. What specific concerns do you have?",
        "Preventive care is so important. Let me help you understand the best practices for maintaining your health.",
        "I can assist you with health education and general wellness guidance. What would you like to learn more about?"
      ]
    };

    const departmentResponses = responses[department] || responses["General Practitioner"];
    return departmentResponses[Math.floor(Math.random() * departmentResponses.length)];
  };

  const detectSymptomKeywords = (message) => {
    const symptomKeywords = [
      'pain', 'ache', 'hurt', 'sore', 'tender', 'headache', 'migraine',
      'fever', 'chills', 'hot', 'cold', 'temperature',
      'cough', 'sneeze', 'runny nose', 'congestion', 'sinus',
      'nausea', 'vomit', 'stomach', 'diarrhea', 'constipation',
      'dizzy', 'lightheaded', 'faint', 'vertigo',
      'tired', 'fatigue', 'exhausted', 'weak', 'energy',
      'rash', 'itchy', 'swollen', 'bruise', 'cut',
      'chest pain', 'shortness of breath', 'breathing', 'wheezing',
      'anxiety', 'depression', 'mood', 'stress', 'sleep',
      'symptom', 'symptoms', 'feeling', 'unwell', 'sick'
    ];
    
    return symptomKeywords.some(keyword => message.includes(keyword));
  };

  const generateSymptomCheckerResponse = (userMessage, department, conversationHistory) => {
    const conversationLength = conversationHistory.length;
    const lowerMessage = userMessage.toLowerCase();
    
    // Initial symptom assessment
    if (conversationLength <= 3) {
      return `I understand you're experiencing some health concerns. Let me help you through a systematic symptom assessment.

**Step 1: Symptom Overview**
Can you describe your main symptoms in detail? Please include:
• What exactly are you feeling?
• When did these symptoms start?
• How severe would you rate them (1-10)?
• Have they gotten worse, better, or stayed the same?

This information will help me provide better guidance and determine if you need immediate medical attention.`;
    }
    
    // Follow-up questions based on symptoms
    if (conversationLength <= 6) {
      if (lowerMessage.includes('pain')) {
        return `**Step 2: Pain Assessment**
Thank you for describing your pain. I need to understand it better:

• Where exactly is the pain located?
• How would you describe it? (sharp, dull, throbbing, burning, stabbing)
• Does it radiate to other areas?
• What makes it better or worse?
• Are you taking any medications for it?

Pain assessment is crucial for proper evaluation. Please be as specific as possible.`;
      }
      
      if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
        return `**Step 2: Fever Assessment**
Fever can indicate various conditions. Let me gather more information:

• Have you measured your temperature? If so, what was it?
• Are you experiencing chills or sweats?
• Any other symptoms like body aches, headache, or fatigue?
• Have you been around anyone who's been sick recently?
• Are you taking any fever-reducing medications?

This will help determine the urgency and potential causes.`;
      }
      
      return `**Step 2: Symptom Progression**
Thank you for the details. Now I need to understand the pattern:

• How long have you had these symptoms?
• Have you noticed any triggers that make them worse?
• Any associated symptoms you haven't mentioned?
• Have you tried any treatments or remedies?
• Any recent changes in your daily routine or environment?

This information helps me provide more accurate guidance.`;
    }
    
    // Assessment and recommendations
    if (conversationLength <= 9) {
      const urgencyLevel = assessUrgencyLevel(lowerMessage);
      
      if (urgencyLevel === 'high') {
        return `**⚠️ URGENT ASSESSMENT RESULT**

Based on your symptoms, I recommend **seeking immediate medical attention**. Here's why:

• Your symptoms may indicate a condition requiring prompt evaluation
• Early intervention can prevent complications
• Professional medical assessment is needed for accurate diagnosis

**Immediate Actions:**
• Contact your doctor or visit an urgent care center
• If symptoms worsen, consider emergency care
• Keep track of any changes in your condition

**When to seek emergency care:**
• Severe difficulty breathing
• Chest pain or pressure
• Severe abdominal pain
• High fever with confusion
• Signs of severe dehydration

Would you like me to help you find nearby medical facilities or provide more specific guidance for your situation?`;
      }
      
      if (urgencyLevel === 'medium') {
        return `**📋 ASSESSMENT RESULT - MODERATE CONCERN**

Based on your symptoms, I recommend **scheduling a medical appointment within the next few days**. Here's my assessment:

**Possible Considerations:**
• Your symptoms warrant professional evaluation
• Early treatment can improve outcomes
• Monitoring is important to prevent progression

**Recommended Actions:**
• Schedule an appointment with your primary care physician
• Continue monitoring your symptoms
• Rest and maintain good hydration
• Avoid strenuous activities until evaluated

**Red Flags - Seek immediate care if you experience:**
• Worsening symptoms
• New concerning symptoms
• Difficulty breathing
• Severe pain

**Self-Care Measures:**
• Get adequate rest
• Stay hydrated
• Eat nutritious foods
• Monitor your temperature

Would you like specific guidance on managing your symptoms or help finding appropriate medical care?`;
      }
      
      return `**✅ ASSESSMENT RESULT - LOW CONCERN**

Based on your symptoms, this appears to be a **minor health concern** that can likely be managed with self-care, though monitoring is still important.

**My Assessment:**
• Your symptoms are common and typically resolve with time
• Self-care measures should help improve your condition
• Low risk of serious complications

**Recommended Self-Care:**
• Get plenty of rest
• Stay well-hydrated
• Maintain a healthy diet
• Use over-the-counter medications as appropriate
• Monitor your symptoms for changes

**When to seek medical care:**
• Symptoms persist beyond expected timeframe
• Symptoms worsen significantly
• New concerning symptoms develop
• You have underlying health conditions

**Follow-up Timeline:**
• If no improvement in 3-5 days, consider seeing a healthcare provider
• Continue monitoring daily

Would you like specific advice on managing your symptoms or information about when to seek medical care?`;
    }
    
    // Ongoing support and follow-up
    return `I'm here to provide ongoing support for your health concerns. Based on our conversation, I can help you:

• Monitor your symptom progression
• Provide guidance on self-care measures
• Help you decide when to seek medical care
• Answer questions about your condition
• Assist with finding appropriate healthcare resources

Is there anything specific about your symptoms or care plan you'd like to discuss further?`;
  };

  const assessUrgencyLevel = (message) => {
    const highUrgencyKeywords = [
      'severe pain', 'chest pain', 'difficulty breathing', 'shortness of breath',
      'high fever', 'severe headache', 'confusion', 'severe nausea',
      'severe abdominal pain', 'blood', 'bleeding', 'severe dizziness',
      'fainting', 'severe anxiety', 'panic attack', 'severe depression'
    ];
    
    const mediumUrgencyKeywords = [
      'persistent pain', 'moderate pain', 'fever', 'headache', 'nausea',
      'vomiting', 'diarrhea', 'rash', 'swelling', 'fatigue',
      'cough', 'sore throat', 'congestion'
    ];
    
    if (highUrgencyKeywords.some(keyword => message.includes(keyword))) {
      return 'high';
    }
    
    if (mediumUrgencyKeywords.some(keyword => message.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  };

  const handleFileUpload = async (file) => {
    try {
      const fileMessage = {
        id: Date.now(),
        message: `I've uploaded a file: ${file.name}`,
        isAi: false,
        timestamp: new Date().toISOString(),
        files: [{ name: file.name, size: file.size, type: file.type }]
      };

      setMessages(prev => [...prev, fileMessage]);
      setShowFileUpload(false);
      setIsLoading(true);

      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiResponse = {
        id: Date.now() + 1,
        message: `I've reviewed your uploaded file "${file.name}". Based on the document, I can provide you with analysis and recommendations. The file appears to contain medical information that I'll factor into my assessment.`,
        isAi: true,
        timestamp: new Date().toISOString(),
        department: departmentName
      };

      setMessages(prev => [...prev, aiResponse]);
      toast.success("File uploaded and analyzed successfully!");
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording started. Speak your question...");
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("This is a voice-recorded message about my health concerns.");
        toast.success("Voice recording completed!");
      }, 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

if (messages.length === 0) {
    return (
      <Empty
        type="chat"
        action={() => setInputMessage("I'm experiencing some symptoms and would like a health assessment.")}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.message}
              isAi={message.isAi}
              timestamp={message.timestamp}
              department={message.department}
              files={message.files}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Bot" size={14} className="text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600">AI Assistant</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <span className="text-sm text-gray-600 ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <AnimatePresence>
          {showFileUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <FileUpload
                onFileUpload={handleFileUpload}
                className="border border-gray-200 rounded-lg p-4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or health concerns for a personalized assessment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none resize-none"
              rows="2"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ApperIcon name="Paperclip" size={20} />
            </button>
            
            <button
              onClick={handleVoiceRecording}
              className={`p-3 rounded-lg transition-colors ${
                isRecording 
                  ? "bg-red-100 text-red-600 voice-recording" 
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              <ApperIcon name={isRecording ? "MicOff" : "Mic"} size={20} />
            </button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3"
            >
              <ApperIcon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;