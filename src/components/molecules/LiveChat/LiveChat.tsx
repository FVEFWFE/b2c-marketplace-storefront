"use client"

import { useState, useEffect } from "react"
import { clsx } from "clsx"
import { Button } from "@medusajs/ui"

interface LiveChatProps {
  productPrice?: number
  productName?: string
  className?: string
  triggerAmount?: number
  autoShow?: boolean
}

interface ChatMessage {
  id: string
  type: "bot" | "agent" | "user"
  message: string
  timestamp: Date
  agentName?: string
}

export const LiveChat = ({
  productPrice = 0,
  productName = "",
  className,
  triggerAmount = 1000,
  autoShow = false
}: LiveChatProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [agentInfo, setAgentInfo] = useState({
    name: "Sarah Chen",
    title: "Premium Sales Specialist",
    responseTime: "< 30 seconds",
    online: true
  })

  const shouldShowChat = productPrice >= triggerAmount || autoShow

  useEffect(() => {
    if (shouldShowChat && !isOpen) {
      // Auto-show chat for high-value items after a delay
      const timer = setTimeout(() => {
        if (productPrice >= 2500) {
          setIsOpen(true)
          initializeChat()
        }
      }, 15000) // Show after 15 seconds for very high-value items

      return () => clearTimeout(timer)
    }
  }, [shouldShowChat, productPrice, isOpen])

  const initializeChat = () => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: "1",
        type: "bot",
        message: "👋 Welcome to ArbVault Premium Support!",
        timestamp: new Date()
      },
      {
        id: "2",
        type: "agent",
        message: `Hi! I'm ${agentInfo.name}, your dedicated specialist for high-value purchases. I see you're interested in ${productName || "this premium item"}. I'm here to help with authentication verification, secure shipping options, or any questions you might have.`,
        timestamp: new Date(),
        agentName: agentInfo.name
      }
    ]
    setMessages(welcomeMessages)
    setIsConnected(true)
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage("")

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        message: "Thanks for your message! Let me check that for you right away. For this high-value item, I can confirm we have it in stock with same-day shipping via UPS with full insurance coverage.",
        timestamp: new Date(),
        agentName: agentInfo.name
      }
      setMessages(prev => [...prev, agentResponse])
    }, 2000)
  }

  if (!shouldShowChat) return null

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            if (!isConnected) initializeChat()
          }}
          className={clsx(
            "fixed bottom-6 right-6 z-50",
            "bg-premium hover:bg-premium-hover text-premium-on-primary",
            "rounded-full p-4 shadow-premium",
            "flex items-center gap-2 font-medium",
            "transform transition-all duration-300 hover:scale-105",
            "animate-pulse",
            className
          )}
        >
          <span className="text-xl">💬</span>
          <span className="hidden sm:inline">Premium Support</span>
          {productPrice >= 2500 && (
            <div className="absolute -top-2 -right-2 bg-positive text-positive-on-primary text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              !
            </div>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={clsx(
          "fixed bottom-6 right-6 z-50",
          "w-96 max-w-[90vw] h-[500px]",
          "bg-component-primary border border-premium rounded-lg shadow-premium",
          "flex flex-col overflow-hidden",
          className
        )}>
          {/* Chat Header */}
          <div className="bg-premium text-premium-on-primary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-premium-on-primary text-premium rounded-full flex items-center justify-center font-bold">
                  {agentInfo.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{agentInfo.name}</p>
                  <p className="text-xs opacity-90">{agentInfo.title}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-2 h-2 bg-positive rounded-full"></div>
                    <span>Online • Responds in {agentInfo.responseTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-premium-on-primary hover:opacity-70 text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-component-secondary p-3 border-b border-primary">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span>🛡️</span>
                <span>Secure Chat</span>
              </div>
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>Verified Agent</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🚀</span>
                <span>White-Glove Service</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx(
                  "flex",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    message.type === "user"
                      ? "bg-action text-action-on-primary"
                      : message.type === "agent"
                      ? "bg-component-secondary text-primary"
                      : "bg-premium-secondary text-premium"
                  )}
                >
                  {message.agentName && (
                    <p className="text-xs font-semibold mb-1">{message.agentName}</p>
                  )}
                  <p>{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-primary">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about authentication, shipping, or anything else..."
                className="flex-1 px-3 py-2 border border-primary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-premium"
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                className="bg-premium hover:bg-premium-hover text-premium-on-primary px-4 py-2"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LiveChat