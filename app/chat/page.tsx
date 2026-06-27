'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Upload, Send, Bot, User, FileText, Trash2, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SAMPLE_QUESTIONS = [
  'ما هو موضوع هذا المستند؟',
  'لخّص المحتوى في 3 نقاط',
  'ما أهم المعلومات الواردة؟',
  'هل يوجد تواريخ أو أرقام مهمة؟',
]

export default function ChatPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfText, setPdfText] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = (textContent.items as { str: string }[]).map((item) => item.str).join(' ')
      fullText += `\n--- صفحة ${i} ---\n${pageText}`
    }
    return fullText.trim()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    if (selectedFile.type !== 'application/pdf') {
      toast.error('يرجى اختيار ملف PDF فقط')
      return
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error('حجم الملف يجب أن يكون أقل من 20 ميجابايت')
      return
    }
    setFile(selectedFile)
    setMessages([])
    setExtracting(true)
    try {
      const text = await extractTextFromPDF(selectedFile)
      if (!text || text.length < 50) {
        toast.error('لم يتم العثور على نص قابل للقراءة. جرّب ملفاً آخر أو استخدم أداة OCR أولاً.')
        setFile(null)
        setExtracting(false)
        return
      }
      setPdfText(text)
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `تم تحميل ملف "${selectedFile.name}" بنجاح! 🎉\n\nيحتوي على ${text.length.toLocaleString('ar')} حرف من النص. يمكنك الآن طرح أي سؤال حول محتوى هذا المستند.`,
          timestamp: new Date(),
        },
      ])
      toast.success('تم قراءة الملف بنجاح!')
    } catch {
      toast.error('حدث خطأ أثناء قراءة الملف')
      setFile(null)
    } finally {
      setExtracting(false)
    }
  }

  const sendMessage = async (userMessage?: string) => {
    const messageText = userMessage || input.trim()
    if (!messageText || !pdfText || loading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const systemPrompt = `أنت مساعد ذكي متخصص في تحليل المستندات. إليك محتوى المستند:\n\n${pdfText.slice(0, 12000)}${pdfText.length > 12000 ? '\n[... المستند يحتوي على محتوى إضافي ...]' : ''}\n\nأجب دائماً باللغة العربية. استند فقط لما ورد في المستند. إذا لم تجد المعلومة قل ذلك بوضوح.`
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText },
          ],
        }),
      })
      if (!response.ok) throw new Error('فشل الاتصال بالخادم')
      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content || data.message || 'عذراً، لم أتمكن من الإجابة.',
          timestamp: new Date(),
        },
      ])
    } catch {
      toast.error('حدث خطأ أثناء الإجابة.')
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
      setInput(messageText)
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setFile(null)
    setPdfText('')
    setMessages([])
    setInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">تحدّث مع PDF</h1>
          <p className="text-gray-600 dark:text-gray-400">ارفع ملف PDF واسأل الذكاء الاصطناعي أي سؤال حول محتواه</p>
        </div>

        {!file ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ارفع ملف PDF للبدء</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">الحد الأقصى للحجم: 20 ميجابايت</p>
            <label className="cursor-pointer">
              <span className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                اختر ملف PDF
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {extracting && (
              <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">جارٍ قراءة الملف...</span>
              </div>
            )}
            <div className="mt-8 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-right">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-400">
                ملفاتك تبقى في متصفحك تماماً — لا يتم رفعها إلى أي خادم. فقط النص المستخرج يُرسل إلى الذكاء الاصطناعي.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col" style={{ height: '70vh' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} ميجابايت</p>
                </div>
              </div>
              <button onClick={clearChat} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
                إغلاق
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                  </div>
                  <div className={`max-w-xs md:max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  أسئلة مقترحة:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="اكتب سؤالك هنا..."
                  rows={1}
                  className="flex-1 resize-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
                  style={{ minHeight: '48px' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">اضغط Enter للإرسال، Shift+Enter لسطر جديد</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
