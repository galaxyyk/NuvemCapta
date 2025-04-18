
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Plus, Trash2, LogOut } from "lucide-react";

function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authorizedEmails, setAuthorizedEmails] = useState([]);
  const [completeBuildings, setCompleteBuildings] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newBuilding, setNewBuilding] = useState({
    name: "",
    address: ""
  });

  useEffect(() => {
    // Carregar dados do localStorage
    const savedEmails = JSON.parse(localStorage.getItem("authorizedEmails")) || [];
    const savedBuildings = JSON.parse(localStorage.getItem("completeBuildings")) || [];
    setAuthorizedEmails(savedEmails);
    setCompleteBuildings(savedBuildings);
  }, []);

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (!newEmail) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    const updatedEmails = [...authorizedEmails, newEmail];
    setAuthorizedEmails(updatedEmails);
    saveToLocalStorage("authorizedEmails", updatedEmails);
    setNewEmail("");
    toast({
      title: "Sucesso",
      description: "Email adicionado com sucesso",
    });
  };

  const handleRemoveEmail = (emailToRemove) => {
    const updatedEmails = authorizedEmails.filter(email => email !== emailToRemove);
    setAuthorizedEmails(updatedEmails);
    saveToLocalStorage("authorizedEmails", updatedEmails);
    toast({
      title: "Sucesso",
      description: "Email removido com sucesso",
    });
  };

  const handleAddBuilding = (e) => {
    e.preventDefault();
    if (!newBuilding.name || !newBuilding.address) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos do prédio",
        variant: "destructive",
      });
      return;
    }

    const updatedBuildings = [...completeBuildings, newBuilding];
    setCompleteBuildings(updatedBuildings);
    saveToLocalStorage("completeBuildings", updatedBuildings);
    setNewBuilding({ name: "", address: "" });
    toast({
      title: "Sucesso",
      description: "Prédio adicionado com sucesso",
    });
  };

  const handleRemoveBuilding = (buildingToRemove) => {
    const updatedBuildings = completeBuildings.filter(building => building.name !== buildingToRemove.name);
    setCompleteBuildings(updatedBuildings);
    saveToLocalStorage("completeBuildings", updatedBuildings);
    toast({
      title: "Sucesso",
      description: "Prédio removido com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <div className="space-x-4">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="hover:bg-gray-700"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Seção de Emails Autorizados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">Emails Autorizados</h2>
            <form onSubmit={handleAddEmail} className="mb-4 flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Adicionar novo email"
                className="flex-1 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </form>
            <ul className="space-y-2">
              {authorizedEmails.map((email, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded"
                >
                  <span>{email}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveEmail(email)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </Button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Seção de Prédios Personalizados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">Prédios Personalizados</h2>
            <form onSubmit={handleAddBuilding} className="mb-4 space-y-3">
              <input
                type="text"
                value={newBuilding.name}
                onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                placeholder="Nome do prédio"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              />
              <input
                type="text"
                value={newBuilding.address}
                onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                placeholder="Endereço do prédio"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Prédio
              </Button>
            </form>
            <ul className="space-y-2">
              {completeBuildings.map((building, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-700 p-3 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{building.name}</h3>
                      <p className="text-sm text-gray-400">{building.address}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveBuilding(building)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
