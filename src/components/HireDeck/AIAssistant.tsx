import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HRUser {
  id: string;
  name: string;
  email: string;
  company_name: string;
  user_type: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  hrUser: HRUser;
}

export default function AIAssistant({ isOpen, onClose, hrUser }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${hrUser.name}! I'm your AI recruitment assistant. I can help you find candidates with specific skills, analyze job requirements, or answer questions about our talent pool. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Simulate AI response - In production, this would call your FastAPI backend
      await new Promise(resolve => setTimeout(resolve, 1500));

      let aiResponse = '';
      const query = inputMessage.toLowerCase();

      if (query.includes('kafka') || query.includes('streaming')) {
        aiResponse = `I found 12 candidates with Kafka experience in our database. Here are the top matches:

🔹 **Sarah Chen** - 4 years exp, Kafka + Spark + Python
🔹 **David Kumar** - 6 years exp, Kafka + Scala + AWS
🔹 **Maria Rodriguez** - 3 years exp, Kafka + Java + Docker

Would you like me to show detailed profiles or filter by specific criteria?`;
      } else if (query.includes('react') || query.includes('frontend')) {
        aiResponse = `Found 28 React developers! Here are some highlights:

🔹 **Alex Thompson** - Senior React Dev, 5+ years, TypeScript expert
🔹 **Priya Sharma** - Full-stack with React/Node.js, 4 years
🔹 **James Wilson** - React Native + Web, 6 years experience

I can filter by experience level, location, or additional skills. What would you prefer?`;
      } else if (query.includes('python') || query.includes('data')) {
        aiResponse = `Great! I have 45 Python developers in our talent pool:

📊 **Data Scientists**: 18 candidates
🔧 **Backend Engineers**: 22 candidates  
🤖 **ML Engineers**: 15 candidates

Top picks:
🔹 **Dr. Lisa Wang** - PhD, 8 years, ML/AI specialist
🔹 **Roberto Silva** - Django expert, 5 years backend
🔹 **Emma Johnson** - Data pipeline architect, 6 years

Which category interests you most?`;
      } else if (query.includes('help') || query.includes('what can you do')) {
        aiResponse = `I can help you with:

🔍 **Candidate Search**: "Show me Java developers with 3+ years experience"
📋 **Skill Matching**: "Find candidates who know both React and Node.js"  
📊 **Market Insights**: "What's the average salary for DevOps engineers?"
🎯 **JD Analysis**: "Analyze this job description and suggest improvements"
📈 **Hiring Trends**: "What skills are most in-demand right now?"

Just ask me anything about finding the right talent for ${hrUser.company_name}!`;
      } else {
        aiResponse = `I understand you're looking for information about "${inputMessage}". Let me search our candidate database and provide you with relevant matches.

Based on your query, I can help you find candidates with specific skills, experience levels, or domain expertise. Could you provide more details about:

• Required experience level (junior/mid/senior)
• Specific technologies or skills
• Employment type preference
• Location requirements

This will help me give you more targeted results!`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-full max-w-md h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Recruitment Assistant</h3>
                    <p className="text-xs text-purple-100">Powered by LLaMA AI</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <Bot className="w-4 h-4 mt-1 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about candidates, skills, or hiring insights..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || loading}
                  className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {['Show me React developers', 'Find Python experts', 'Kafka specialists'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}