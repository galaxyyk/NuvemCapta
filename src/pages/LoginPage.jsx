import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase'


const ADMIN_EMAIL = "kauabiruel@proton.me";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Primeiro, tentamos fazer login com o Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Email ou senha incorretos.",
      });
      return;
    }

    // Se o login foi bem-sucedido, agora verificamos se o e-mail está na lista de autorizados
    const { data: authorizedEmails, error: authorizedError } = await supabase
      .from("emails_autorizados")
      .select("email")
      .eq("email", formData.email)
      .single(); // Verifica se encontra um único resultado

    if (authorizedError || !authorizedEmails) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Este email não está autorizado.",
      });
      return;
    }

    // Se for o admin, setamos no localStorage
    if (formData.email === ADMIN_EMAIL) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", formData.email);
      toast({
        title: "Login de administrador realizado com sucesso!",
        description: "Bem-vindo, administrador!",
      });
      navigate("/admin");
    } else {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", formData.email);
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#37a76f]/10 via-[#333333]/10 to-[#dbae8e]/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 gradient-text">
          Acesse sua conta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full hero-gradient text-white">
            Entrar
          </Button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Não tem uma conta?{" "}
          <button
            onClick={() => navigate("/payment")}
            className="text-[#37a76f] hover:underline"
          >
            Assine agora
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
