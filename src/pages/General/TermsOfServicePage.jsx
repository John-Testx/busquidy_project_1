import { Footer, Navbar } from '@/components/Home/';

function TermsOfServicePage() {
    return (
        <div style={{ marginTop: "80px" }}>
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto">
                <h1>Términos de Servicio</h1>
                <p>Aquí van los términos de servicio...</p>
            </div>
            <Footer />
        </div>
    );
}

export default TermsOfServicePage;