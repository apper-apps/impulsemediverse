import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import FileUpload from "@/components/molecules/FileUpload";
import ChatMessage from "@/components/molecules/ChatMessage";
import departmentsData from "@/services/mockData/departments.json";
import medicalRecordsData from "@/services/mockData/medicalRecords.json";
import healthTrendsData from "@/services/mockData/healthTrends.json";
import consultationsData from "@/services/mockData/consultations.json";
import { consultationService } from "@/services/api/consultationService";
const ChatInterface = ({ departmentId, departmentName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          setInputMessage(prev => prev + finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setTranscript("");
        
        switch (event.error) {
          case 'no-speech':
            toast.error("No speech detected. Please try again.");
            break;
          case 'not-allowed':
            toast.error("Microphone access denied. Please enable microphone permissions.");
            break;
          case 'network':
            toast.error("Network error. Please check your connection.");
            break;
          default:
            toast.error("Speech recognition error. Please try again.");
        }
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        setTranscript("");
      };
      
      setSpeechRecognition(recognition);
    }
  }, []);

useEffect(() => {
    // Load initial greeting message with symptom checker introduction
    const greeting = {
      id: Date.now(),
      message: `Good day! I'm Dr. ${departmentName} AI, your dedicated medical specialist with over 20 years of clinical experience in ${departmentName.toLowerCase()} medicine. I've been trained on thousands of cases and evidence-based medical practices to provide you with the most accurate and professional healthcare guidance.

**My Clinical Expertise:**
• Advanced symptom analysis using proven diagnostic methodologies
• Evidence-based treatment recommendations from peer-reviewed research
• Risk stratification based on decades of clinical experience
• Comprehensive health assessments following medical best practices
• Integration of patient history, symptoms, and clinical indicators

**Professional Standards:**
I maintain the highest standards of medical professionalism and will guide you through a thorough, systematic evaluation of your health concerns. My approach combines clinical expertise with compassionate care, ensuring you receive the same quality of assessment you'd expect from a seasoned medical professional.

Please describe your symptoms or health concerns in detail. I'll conduct a comprehensive assessment using my extensive medical knowledge and experience. You may communicate through text or voice - I'm here to provide expert medical guidance. How may I assist you today?`,
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
        "Drawing from my 20 years of clinical experience, your symptoms warrant a systematic evaluation. Let me guide you through a comprehensive assessment - first, I need to understand the chronology and characteristics of your presentation. When did you first notice these symptoms, and have you observed any patterns or triggers?",
        "As a seasoned practitioner, I've encountered similar presentations countless times. Your concerns are valid, and I want to ensure we conduct a thorough evaluation. Based on established clinical protocols, I need to gather more specific information about your medical history and current symptoms to provide accurate guidance.",
        "Thank you for providing those details. In my extensive practice, I've learned that proper symptom analysis requires multiple data points. Let me apply evidence-based assessment methods to your case. Based on current medical literature and my clinical experience, here's my professional evaluation..."
      ],
      "Cardiologist": [
        "As a cardiologist with two decades of specialized experience, I take all cardiovascular symptoms seriously. Your heart health is paramount, and I want to conduct a thorough cardiac risk assessment. Please provide detailed information about your family cardiac history, current medications, and any precipitating factors. This systematic approach has proven invaluable in my years of practice.",
        "In my 20 years of cardiology practice, I've learned that cardiovascular symptoms require immediate and comprehensive evaluation. The frequency, intensity, and associated symptoms you're experiencing are critical indicators. Let me apply advanced cardiac assessment protocols to better understand your condition.",
        "Your cardiac concerns align with patterns I've observed throughout my extensive clinical career. Based on established cardiology guidelines and my professional experience, I need to evaluate your risk factors systematically. Please share your current medications, lifestyle factors, and any recent changes in your cardiovascular health."
      ],
      "Neurologist": [
        "As a neurologist with 20 years of specialized experience, I understand the complexity of neurological presentations. Your symptoms require careful analysis using established neurological assessment protocols. In my practice, I've found that understanding the temporal pattern and associated features is crucial for accurate diagnosis.",
        "Drawing from my extensive neurological practice, I recognize that your concerns require sophisticated evaluation. Neurological conditions often present with subtle patterns that become clear through systematic assessment. Let me apply advanced neurological diagnostic principles to understand your symptoms comprehensively.",
        "Thank you for these detailed observations. In my two decades of neurology practice, I've learned that thorough symptom characterization is essential. Based on established neurological diagnostic criteria and my clinical experience, I can provide you with evidence-based recommendations and guidance."
      ],
      "Psychologist": [
        "As a clinical psychologist with 20 years of experience, I understand that mental health concerns require both professional expertise and compassionate understanding. Your psychological well-being is as important as your physical health. Let me apply evidence-based therapeutic approaches to address your concerns comprehensively.",
        "In my extensive practice, I've learned that psychological challenges require skilled assessment and individualized treatment approaches. Your trust in sharing these concerns is the foundation of effective therapy. Let me use established clinical methods to better understand your situation and provide professional guidance.",
        "Thank you for your openness. Throughout my 20 years of clinical practice, I've worked with countless individuals facing similar challenges. Mental health recovery is indeed a journey, and I'm here to provide expert guidance using proven therapeutic techniques and evidence-based interventions."
      ],
      "General Nurse": [
        "As a registered nurse with 20 years of clinical experience, I'm here to provide comprehensive health education and evidence-based wellness guidance. Preventive care has been a cornerstone of my practice, and I can share proven strategies for maintaining optimal health. What specific aspects of your health management would you like to address?",
        "Drawing from my two decades of nursing experience, I understand that preventive care and patient education are fundamental to health outcomes. Let me share evidence-based best practices and clinical insights I've gained through years of patient care. Together, we can develop a comprehensive approach to your health concerns.",
        "Your health questions are important, and I'm here to provide professional nursing guidance based on my extensive clinical experience. Throughout my 20-year career, I've learned that effective health education requires personalized approaches. Let me share evidence-based strategies tailored to your specific needs."
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
      return `I understand you're experiencing health concerns, and I want to assure you that you're receiving professional-grade medical assessment. Drawing from my 20 years of clinical experience, I'll conduct a comprehensive symptom evaluation using established medical protocols.

**Professional Clinical Assessment - Phase 1: Symptom Characterization**

As a medical professional, I need to gather specific clinical data to provide accurate guidance. Please provide detailed information about:

**Primary Symptom Profile:**
• Precise description of your symptoms (quality, character, location)
• Onset timing and circumstances (gradual vs. sudden)
• Severity assessment using validated pain/symptom scales (1-10)
• Progression pattern (improving, worsening, or stable)
• Associated symptoms or systemic manifestations

**Clinical History:**
• Duration of symptoms
• Precipitating factors or triggers
• Previous similar episodes
• Current medications and recent changes
• Relevant medical history

This systematic approach, refined through decades of clinical practice, ensures I can provide you with the most accurate professional assessment and appropriate medical guidance.`;
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
        return `**🚨 URGENT CLINICAL ASSESSMENT - IMMEDIATE MEDICAL ATTENTION REQUIRED**

Based on my 20 years of clinical experience and evidence-based medical protocols, your symptom constellation indicates a **HIGH-PRIORITY MEDICAL CONDITION** requiring immediate professional intervention.

**Clinical Rationale:**
• Your symptoms align with conditions that require urgent medical evaluation
• Early medical intervention is critical to prevent potential complications
• The symptom pattern suggests time-sensitive pathology
• Delayed treatment could result in adverse outcomes

**Professional Recommendations - IMMEDIATE ACTION REQUIRED:**

**Primary Actions:**
• **Contact your physician immediately** or proceed to urgent care
• **If symptoms worsen or new concerning symptoms develop, seek emergency care**
• **Document all symptoms and their progression** for medical providers
• **Bring current medications and medical history** to your appointment

**RED FLAG SYMPTOMS - Call 911 immediately if you experience:**
• Severe respiratory distress or inability to breathe
• Chest pain with radiation or pressure sensation
• Severe abdominal pain with systemic symptoms
• High fever (>38.5°C/101.3°F) with altered mental status
• Signs of severe dehydration or circulatory compromise
• Neurological symptoms (confusion, severe headache, vision changes)

**Clinical Follow-up:**
Based on my extensive experience, I strongly recommend expedited medical evaluation. Would you like assistance locating appropriate medical facilities or guidance on presenting your symptoms to healthcare providers?`;
      }
      
if (urgencyLevel === 'medium') {
        return `**📋 PROFESSIONAL CLINICAL ASSESSMENT - MODERATE PRIORITY**

Based on my 20 years of clinical experience and systematic symptom evaluation, your condition requires **professional medical attention within 24-48 hours**. This assessment follows established clinical guidelines and evidence-based medicine principles.

**Clinical Assessment:**
• Your symptom profile indicates a condition requiring professional evaluation
• Early medical intervention will optimize treatment outcomes
• Systematic monitoring is essential to prevent symptom progression
• The clinical presentation warrants structured medical management

**Professional Recommendations:**

**Primary Actions:**
• **Schedule appointment with your primary care physician within 24-48 hours**
• **Implement symptom monitoring protocol** (frequency, severity, associated symptoms)
• **Maintain comprehensive symptom diary** for medical consultation
• **Follow evidence-based supportive care measures**

**Clinical Management Guidelines:**
• Adequate rest and sleep hygiene (7-9 hours)
• Optimal hydration (2-3 liters daily unless contraindicated)
• Balanced nutrition with emphasis on immune-supporting nutrients
• Avoid strenuous physical activity until medical clearance
• Temperature monitoring if fever is present

**RED FLAG SYMPTOMS - Seek immediate medical care if you develop:**
• Significant worsening of current symptoms
• New concerning symptoms or systemic manifestations
• Respiratory distress or breathing difficulties
• Severe pain (>7/10 on pain scale)
• High fever with systemic symptoms
• Signs of dehydration or circulatory compromise

**Professional Follow-up:**
Would you like specific evidence-based guidance on symptom management or assistance finding appropriate medical care? I can provide detailed recommendations based on your specific clinical presentation.`;
      }
      
return `**✅ PROFESSIONAL CLINICAL ASSESSMENT - LOW ACUITY**

Based on my 20 years of clinical experience and evidence-based assessment protocols, your symptom presentation indicates a **low-acuity condition** that can be effectively managed with professional-grade self-care measures. However, as a medical professional, I emphasize the importance of continued monitoring.

**Clinical Assessment:**
• Your symptoms align with common, self-limiting conditions
• Evidence-based self-care interventions should provide symptom relief
• Low probability of serious complications based on clinical presentation
• Prognosis is excellent with appropriate management

**Professional Self-Care Protocol:**

**Primary Interventions:**
• **Rest and recovery:** 7-9 hours of quality sleep
• **Hydration management:** 2-3 liters of fluid daily (water, herbal teas, clear broths)
• **Nutritional support:** Balanced diet with emphasis on vitamin C, zinc, and anti-inflammatory foods
• **Symptom relief:** Appropriate over-the-counter medications as per established guidelines
• **Activity modification:** Gradual return to normal activities as tolerated

**Clinical Monitoring Parameters:**
• **Daily symptom assessment:** Severity, frequency, and associated symptoms
• **Temperature monitoring:** If fever is present
• **Functional assessment:** Impact on daily activities
• **Symptom diary:** Document patterns and triggers

**Medical Consultation Indicators:**
• **Symptom persistence:** No improvement within 5-7 days
• **Symptom progression:** Worsening severity or new symptoms
• **Functional impairment:** Significant impact on daily activities
• **Comorbidity considerations:** If you have underlying health conditions

**Evidence-Based Timeline:**
• **Days 1-3:** Initial symptom management and monitoring
• **Days 4-7:** Expected symptom improvement
• **Day 7+:** Medical consultation if no improvement

Would you like specific evidence-based recommendations for symptom management or detailed guidance on when to seek medical consultation? I can provide professional protocols tailored to your specific presentation.`;
    }
    
// Ongoing support and follow-up
    return `As your dedicated medical professional with 20 years of clinical experience, I'm committed to providing comprehensive ongoing support for your health concerns. Based on our thorough clinical assessment, I can continue to offer expert guidance in several areas:

**Ongoing Professional Support:**
• **Advanced symptom monitoring:** Using clinical protocols and evidence-based assessment tools
• **Personalized care recommendations:** Tailored to your specific clinical presentation
• **Medical decision support:** Helping you determine appropriate timing for professional care
• **Clinical education:** Answering questions about your condition using medical expertise
• **Healthcare navigation:** Assisting with finding appropriate medical resources and specialists

**Evidence-Based Follow-up:**
• **Risk stratification:** Continued assessment of your symptom progression
• **Treatment optimization:** Adjusting recommendations based on your response
• **Complication prevention:** Identifying early warning signs requiring intervention
• **Care coordination:** Guidance on communicating with healthcare providers

**Professional Commitment:**
Drawing from my extensive clinical experience, I remain dedicated to providing you with the highest standard of medical guidance. Your health outcomes are my priority, and I'm here to support you with professional expertise throughout your care journey.

Is there anything specific about your symptoms, treatment plan, or medical concerns you'd like to discuss further? I'm here to provide detailed, evidence-based guidance tailored to your individual needs.`;
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
const startVoiceRecording = () => {
    if (!speechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }
    
    setIsRecording(true);
    setTranscript("");
    
    try {
      speechRecognition.start();
      toast.info("Voice recording started. Speak your question...");
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsRecording(false);
      toast.error("Failed to start voice recording. Please try again.");
    }
  };
  
  const stopVoiceRecording = () => {
    if (speechRecognition && isRecording) {
      speechRecognition.stop();
      toast.success("Voice recording completed!");
    }
  };
  
  const handleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
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
        
        {/* Real-time transcript display */}
        <AnimatePresence>
          {isRecording && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">Live Transcription</span>
              </div>
              <p className="text-sm text-blue-800 italic">"{transcript}"</p>
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
              title="Upload file"
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
              title={isRecording ? "Stop recording" : "Start voice recording"}
              disabled={!speechRecognition}
            >
              <ApperIcon name={isRecording ? "MicOff" : "Mic"} size={20} />
            </button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3"
              title="Send message"
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