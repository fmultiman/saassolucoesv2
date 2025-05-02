export function SobreSection() {
  return (
    <section id="sobre" className="py-20 bg-accent/50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Criamos soluções simples, inteligentes e pensadas para gerar resultados reais.
          </h2>
          <p className="text-lg text-muted-foreground">
            Desenvolvida por especialistas em automação e IA, nossa plataforma nasceu para ajudar você a trabalhar com
            mais inteligência e menos esforço. Tudo é modular, pronto para uso e evolui conforme seu negócio cresce.
          </p>
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">40+</h3>
              <p className="text-muted-foreground">Soluções prontas</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">1.200+</h3>
              <p className="text-muted-foreground">Clientes ativos</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-primary">98%</h3>
              <p className="text-muted-foreground">Satisfação</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
