import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, PieChart, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-500 rounded-full">
              <Wallet className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            FinanceApp
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Controle suas finanças pessoais de forma simples e eficiente
          </p>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Gerencie suas contas, transações, orçamentos e metas financeiras em um só lugar
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle>Controle Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Acompanhe suas receitas e despesas com gráficos intuitivos e relatórios detalhados
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <CardTitle>Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Defina orçamentos por categoria e receba alertas quando estiver próximo do limite
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle>Metas Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Estabeleça e acompanhe suas metas de economia com visualização de progresso
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
