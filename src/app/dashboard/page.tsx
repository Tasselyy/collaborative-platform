"use client"
import { authClient } from "@/lib/auth-client"
import { useEffect, useState } from "react"

export default function Page() {
  const { data: session } = authClient.useSession();
  const [sessionString, setSessionString] = useState('');
  
  useEffect(() => {
    if (session) {
      setSessionString(JSON.stringify(session, null, 2));
    } else {
      setSessionString('No session data available');
    }
  }, [session]);

  return (
    <div>
      <h1>Session Data</h1>
      <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
        {sessionString}
      </pre>
    </div>
  )
}
