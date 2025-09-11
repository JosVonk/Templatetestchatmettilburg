import SportsChatBot from '@/components/SportsChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏒 Sports Marketing Interview Bot
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6 max-w-3xl mx-auto">
            Interview marketing managers van toonaangevende sportmerken. Leer over hun strategieën, uitdagingen en visie op de markt.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              🎯 Voor Studenten Marketing & Sport Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Realistische gesprekken met marketing managers
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Leer over merkstrategie en positionering
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Ontdek uitdagingen in de sportindustrie
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Krijg inzicht in doelgroepstrategieën
              </div>
            </div>
          </div>
        </div>

        {/* Main Chatbot */}
        <div className="max-w-4xl mx-auto">
          <SportsChatBot />
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-blue-600">
            <span>🏒</span>
            <span>Veel succes met je interviews!</span>
            <span>🏒</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Sports Marketing Interview Bot • Powered by AI • Voor educatieve doeleinden
          </p>
        </div>
      </div>
    </div>
  )
}