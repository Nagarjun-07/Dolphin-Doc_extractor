
'use client';

import { qaOnDocument } from '@/ai/flows/qa-on-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare, Send, User, X } from 'lucide-react';
import React, { useState, useRef, useEffect, FormEvent } from 'react';

interface ChatbotProps {
  documentContext: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function Chatbot({ documentContext }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "I'm ready to help! Please feel free to ask me anything about the document you've uploaded.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await qaOnDocument({
        documentContent: documentContext,
        question: inputValue,
      });
      const botMessage: Message = { role: 'bot', content: response.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response from chatbot:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full h-16 w-16 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <MessageSquare size={32} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[400px] h-[500px] shadow-lg z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
           <MessageSquare className="text-primary" />
           <CardTitle className="text-lg">Document Chat</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chat">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full">
            <div ref={scrollAreaRef} className="p-4 space-y-4">
            {messages.map((message, index) => (
                <div
                key={index}
                className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                {message.role === 'bot' && (
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <MessageSquare size={16} />
                    </div>
                )}
                <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                    message.role === 'user'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-card border'
                    }`}
                >
                    {message.content}
                </div>
                {message.role === 'user' && (
                    <div className="bg-muted text-muted-foreground rounded-full p-2">
                        <User size={16} />
                    </div>
                )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <MessageSquare size={16} />
                    </div>
                    <div className="rounded-lg px-3 py-2 bg-card border flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
                id="message"
                placeholder="Type your question..."
                className="flex-1"
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
