import Image from "next/image"
import { Users, Award, Truck, Heart } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Sobre a ChuteirasPro</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Somos especialistas em chuteiras profissionais, oferecendo os melhores produtos para elevar seu desempenho em
          campo.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              A ChuteirasPro nasceu da paixão pelo futebol e do desejo de oferecer aos jogadores brasileiros acesso às
              melhores chuteiras do mundo. Fundada em 2020, começamos como uma pequena loja física especializada em
              calçados esportivos.
            </p>
            <p>
              Com o crescimento da demanda e a necessidade de alcançar mais jogadores em todo o Brasil, expandimos para
              o digital, mantendo sempre nosso compromisso com a qualidade e autenticidade dos produtos.
            </p>
            <p>
              Hoje, somos referência nacional em chuteiras profissionais, atendendo desde jogadores amadores até atletas
              profissionais, sempre com o mesmo cuidado e dedicação que nos trouxe até aqui.
            </p>
          </div>
        </div>
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="Nossa loja" fill className="object-cover" />
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Qualidade</h3>
            <p className="text-sm text-gray-600">
              Trabalhamos apenas com produtos originais das melhores marcas do mundo.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Atendimento</h3>
            <p className="text-sm text-gray-600">Nossa equipe especializada está sempre pronta para ajudar você.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Entrega</h3>
            <p className="text-sm text-gray-600">Entregamos em todo o Brasil com rapidez e segurança.</p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Paixão</h3>
            <p className="text-sm text-gray-600">
              Amamos o futebol e queremos que você jogue com o melhor equipamento.
            </p>
          </div>
        </div>
      </div>

      {/* Numbers */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">ChuteirasPro em Números</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <p className="text-gray-600">Clientes Satisfeitos</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600">Modelos Disponíveis</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">15</div>
            <p className="text-gray-600">Marcas Parceiras</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">4.9</div>
            <p className="text-gray-600">Avaliação Média</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Nossa Equipe</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Contamos com uma equipe apaixonada por futebol e especializada em calçados esportivos, sempre pronta para
          oferecer a melhor experiência de compra.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "João Silva", role: "Fundador & CEO", image: "/placeholder.svg?height=200&width=200" },
            { name: "Maria Santos", role: "Especialista em Produtos", image: "/placeholder.svg?height=200&width=200" },
            { name: "Carlos Lima", role: "Atendimento ao Cliente", image: "/placeholder.svg?height=200&width=200" },
          ].map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
