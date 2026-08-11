import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, Check, Loader2 } from "lucide-react"
import { authService } from "../../services/authService"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"

export function SetupWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "njeirheinard@gmail.com",
    password: "@maxim2022",
    storeName: "Jo Accessories"
  })

  useEffect(() => {
    // Check if already setup
    const checkSetup = async () => {
      try {
        const docRef = doc(db, 'settings', 'system')
        const snap = await getDoc(docRef)
        if (snap.exists() && snap.data().isSetupComplete) {
          navigate('/account')
        }
      } catch (err) {
        console.error("Setup check error", err)
      }
    }
    checkSetup()
  }, [navigate])

  const handleSetup = async () => {
    setLoading(true)
    setError("")
    try {
      // 1. Create the Super Admin account
      await authService.registerWithEmail(formData.email, formData.password, "Store Owner", "")
      
      // 2. Mark system as setup
      const systemRef = doc(db, 'settings', 'system')
      await setDoc(systemRef, {
        isSetupComplete: true,
        storeName: formData.storeName,
        createdAt: Date.now()
      })

      // 3. Initialize default roles
      // Note: role definitions are in rbac.ts, but we could store settings
      
      setStep(3)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Account already exists. Try logging in instead.")
        // Optionally mark setup as complete if the account exists
        try {
          const systemRef = doc(db, 'settings', 'system')
          await setDoc(systemRef, { isSetupComplete: true }, { merge: true })
          navigate('/account')
        } catch(e) {}
      } else {
        setError(err.message || "An error occurred during setup.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-ash">
          <Shield className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-ash">
          System Initialization
        </h2>
        <p className="mt-2 text-center text-sm text-ash-muted">
          Enterprise Ecommerce Platform Setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-ash">Welcome to Jo Accessories</h3>
                <p className="mt-1 text-sm text-ash-muted">
                  This one-time wizard will initialize your database, configure enterprise security rules, and create the Super Admin account.
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ash hover:bg-ash/90"
              >
                Begin Setup
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ash">Store Owner Email</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="mt-1 block w-full border border-ash-light rounded-md shadow-sm py-2 px-3 bg-white text-ash-muted sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ash">Admin Password</label>
                <input
                  type="text"
                  disabled
                  value={formData.password}
                  className="mt-1 block w-full border border-ash-light rounded-md shadow-sm py-2 px-3 bg-white text-ash-muted sm:text-sm"
                />
              </div>
              <button
                onClick={handleSetup}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ash hover:bg-ash/90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Platform"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-ash">Setup Complete</h3>
              <p className="text-sm text-ash-muted">
                The enterprise platform has been successfully initialized. You can now access the admin dashboard.
              </p>
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ash hover:bg-ash/90"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
