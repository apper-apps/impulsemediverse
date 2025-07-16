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
    // Load initial greeting message
    const greeting = {
      id: Date.now(),
      message: `Hello! I'm your AI ${departmentName} assistant. I'm here to help you with your health concerns. How can I assist you today?`,
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
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = {
        id: Date.now() + 1,
        message: generateAIResponse(inputMessage, departmentName),
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

  const generateAIResponse = (userMessage, department) => {
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
        action={() => setInputMessage("Hello, I need help with my health concerns.")}
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
              placeholder="Type your health question here..."
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