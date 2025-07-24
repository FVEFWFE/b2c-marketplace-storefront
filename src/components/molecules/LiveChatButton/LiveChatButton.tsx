"use client"

import { useState } from "react"
import { MessageIcon } from "@/icons"
import { Button } from "@/components/atoms"
import { Chatbox } from "@talkjs/react"
import Talk from "talkjs"

interface LiveChatButtonProps {
  productPrice?: number
  productName?: string
  sellerId?: string
  sellerName?: string
  className?: string
  priceThreshold?: number
}

export function LiveChatButton({
  productPrice = 0,
  productName = "Product",
  sellerId = "support",
  sellerName = "ArbVault Support",
  className = "",
  priceThreshold = 1000, // Show live chat for products over $1000
}: LiveChatButtonProps) {
  const [showChat, setShowChat] = useState(false)

  // Only show for expensive items
  if (productPrice < priceThreshold) {
    return null
  }

  const handleChatClick = () => {
    setShowChat(!showChat)
  }

  return (
    <>
      <div className={`${className}`}>
        <Button
          onClick={handleChatClick}
          className="bg-action hover:bg-action-hover text-action-on-primary flex items-center gap-2"
        >
          <MessageIcon size={20} />
          <span>Live Chat - Get Expert Help</span>
        </Button>
        <p className="text-xs text-tertiary mt-1">
          Available for high-value purchases. Get instant answers from our experts.
        </p>
      </div>

      {showChat && (
        <div className="fixed bottom-20 right-4 z-50 w-96 h-[500px] bg-primary rounded-lg shadow-xl border border-secondary">
          <div className="flex justify-between items-center p-4 border-b border-secondary">
            <h3 className="font-semibold">Live Support - {productName}</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-secondary hover:text-primary"
            >
              ✕
            </button>
          </div>
          <div className="h-[calc(100%-60px)]">
            <Chatbox
              conversationId={`product-${sellerId}-${Date.now()}`}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  )
}