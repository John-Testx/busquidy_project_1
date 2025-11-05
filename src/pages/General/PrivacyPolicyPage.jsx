import React from 'react';
import { Footer, Navbar } from '@/components/Home/';


function PrivacyPolicyPage() {
    return (
        <div style={{ marginTop: "80px" }}>
            <Navbar />
                <div className="p-8 max-w-4xl mx-auto">
                    
                    <h1>Política de Privacidad</h1>
                    <p>Aquí va la política de privacidad...</p>
                    
                </div>
            <Footer />
        </div>
    );
}

export default PrivacyPolicyPage;