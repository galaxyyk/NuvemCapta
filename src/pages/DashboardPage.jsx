
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 50;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("address");
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [completeBuildings, setCompleteBuildings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const savedBuildings = JSON.parse(localStorage.getItem("completeBuildings") || "[]");
    setCompleteBuildings(savedBuildings);

    const loadData = async () => {
      try {
        const cachedData = sessionStorage.getItem("propertiesData");
        if (cachedData) {
          setData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const response = await fetch("https://raw.githubusercontent.com/galaxyyk/imobiliaria-serenity/refs/heads/main/imoveis.json");
        const jsonData = await response.json();
        setData(jsonData);
        sessionStorage.setItem("propertiesData", JSON.stringify(jsonData));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Por favor, tente novamente mais tarde.",
        });
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, toast]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchTerm
        ? (item[searchType]?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        : true;
      const matchesBuilding = selectedBuilding
        ? item.building === selectedBuilding
        : true;
      return matchesSearch && matchesBuilding;
    });
  }, [data, searchTerm, searchType, selectedBuilding]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold gradient-text">Dashboard Imobiliário</h1>
          <div className="flex gap-4">
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                className="hero-gradient text-white"
              >
                Painel Admin
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:sticky md:top-24 h-fit"
          >
            <h2 className="text-xl font-bold mb-4 gradient-text">Prédios Completos</h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              <button
                onClick={() => setSelectedBuilding(null)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  !selectedBuilding
                    ? "bg-[#37a76f] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Todos os prédios
              </button>
              {completeBuildings.map((building, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedBuilding(building)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedBuilding === building
                      ? "bg-[#37a76f] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {building}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select
                  value={searchType}
                  onValueChange={setSearchType}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tipo de busca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address">Endereço</SelectItem>
                    <SelectItem value="building">Prédio</SelectItem>
                    <SelectItem value="complement">Complemento</SelectItem>
                    <SelectItem value="inscription">Inscrição</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#37a76f] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando dados...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Endereço
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prédio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Complemento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inscrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence mode="wait">
                          {paginatedData.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.address}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.building}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.complement}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.inscription}
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          className={currentPage === page ? "bg-[#37a76f]" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
