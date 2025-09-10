
import MainLayout from '../Layout/MainLayout';

export default function Landing() {
  return (
    <MainLayout>
      <section className="container-pro py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 fade-in">
            <div className="kicker">MockCam</div>
            <h1 className="h1">Escolha inteligente. Interface limpa para sua câmera ESP32.</h1>
            <p className="p max-w-prose">Gerencie stream, snapshots e gravações sem ruído visual. Um layout minimalista que favorece o que importa: o vídeo.</p>
            <div className="flex gap-3">
              <a className="btn-solid" href="/camera">Abrir app</a>
              <a className="btn-ghost" href="/dashboard">Dashboard</a>
            </div>
          </div>
          <div className="card p-4 md:p-6 fade-in">
            <div className="aspect-video rounded-xl bg-black/5 flex items-center justify-center">
              <span style={{color:'rgb(102 112 133)'}}>Preview do stream</span>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
