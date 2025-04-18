
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreditCard, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleCopyPix = () => {
    navigator.clipboard.writeText("12483465994");
    toast({
      title: "Chave PIX copiada!",
      description: "Cole a chave no seu aplicativo de pagamento.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#37a76f]/20 via-[#333333]/20 to-[#dbae8e]/20 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#37a76f] to-[#dbae8e] p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Finalizar Compra</h1>
            <p className="text-center mt-2 opacity-90">Imobiliária Serenity - Acesso Premium</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div>
                <h2 className="text-2xl font-semibold">Plano Premium</h2>
                <p className="text-gray-600 mt-1">Acesso completo ao sistema</p>
              </div>
              <div className="text-3xl font-bold text-[#37a76f]">R$ 2.500,00</div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Escolha o método de pagamento</h3>
              
              {/* PIX Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === "pix"
                    ? "border-[#37a76f] bg-[#37a76f]/5"
                    : "border-gray-200 hover:border-[#37a76f]/50"
                }`}
                onClick={() => setPaymentMethod("pix")}
              >
                <div className="flex items-center gap-4 mb-4">
                  <QrCode className="w-8 h-8 text-[#37a76f]" />
                  <div>
                    <h4 className="text-lg font-semibold">Pagar com PIX</h4>
                    <p className="text-sm text-gray-600">Transferência instantânea</p>
                  </div>
                </div>
                {paymentMethod === "pix" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm mb-2">Chave PIX (CPF):</p>
                    <div className="flex gap-2">
                      <code className="flex-1 p-2 bg-white rounded border">
                        124.834.659-94
                      </code>
                      <Button onClick={handleCopyPix} variant="outline">
                        Copiar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Card Option - Coming Soon */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border-2 border-gray-200 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-8 h-8" />
                  <div>
                    <h4 className="text-lg font-semibold">Cartão de Crédito</h4>
                    <p className="text-sm text-gray-600">Em breve disponível</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="text-gray-600"
              >
                Voltar para a página inicial
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
