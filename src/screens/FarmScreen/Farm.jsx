import Block from '../../components/Block/Block';
import Menu from '../../components/Menu/Menu';
import ToolBox from '../../components/ToolBox/ToolBox';
import MoneyMenu from '../../components/MoneyMenu/MoneyMenu';
import legumes from '../../data/legumes';
import './Farm.css';    
import { useState, useEffect } from 'react';

const Farm = () => {
    // Carrega dados salvos do localStorage ou usa valores padrão
    const loadFromStorage = (key, defaultValue) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Erro ao carregar ${key} do localStorage:`, error);
            return defaultValue;
        }
    };

    const [money, setMoney] = useState(() => loadFromStorage('farm_money', 2000));
    const [legumesPlantados, setLegumesPlantados] = useState(() => loadFromStorage('farm_legumes', []));
    const [inventory, setInventory] = useState(() => loadFromStorage('farm_inventory', {}));
    // Levels individuais de cada legume: { legumeId: level }
    const [legumeLevels, setLegumeLevels] = useState(() => loadFromStorage('farm_legume_levels', {}));
    
    // Estado da semente selecionada para plantar
    const [selectedSeed, setSelectedSeed] = useState(null);
    
    // Salva no localStorage sempre que money mudar
    useEffect(() => {
        localStorage.setItem('farm_money', JSON.stringify(money));
    }, [money]);
    
    // Salva no localStorage sempre que inventory mudar
    useEffect(() => {
        localStorage.setItem('farm_inventory', JSON.stringify(inventory));
    }, [inventory]);
    
    // Salva no localStorage sempre que legumesPlantados mudar
    useEffect(() => {
        localStorage.setItem('farm_legumes', JSON.stringify(legumesPlantados));
    }, [legumesPlantados]);
    
    // Salva no localStorage sempre que legumeLevels mudar
    useEffect(() => {
        localStorage.setItem('farm_legume_levels', JSON.stringify(legumeLevels));
    }, [legumeLevels]);
    
    // Função para obter o level de um legume (padrão: 1)
    const getLegumeLevel = (legumeId) => {
        return legumeLevels[legumeId] || 1;
    };
    
    // Função para calcular o preço do próximo level de um legume
    const getLevelUpPrice = (legumeId) => {
        const currentLevel = getLegumeLevel(legumeId);
        // Preço base de 3000, aumenta exponencialmente: base * (1.5 ^ (level - 1))
        return Math.floor(3000 * Math.pow(1.5, currentLevel - 1));
    };
    
    // Função para aumentar o level de um legume específico
    const handleLevelUp = (legumeId) => {
        const nextLevelPrice = getLevelUpPrice(legumeId);
        if (money >= nextLevelPrice) {
            setMoney(prev => prev - nextLevelPrice);
            setLegumeLevels(prev => ({
                ...prev,
                [legumeId]: (prev[legumeId] || 1) + 1
            }));
        }
    };
    
    // Função para calcular preço de compra com base no level
    const getPrecoCompra = (legume) => {
        const level = getLegumeLevel(legume.id);
        // Preço aumenta 20% por level (multiplicador: 1.2 ^ (level - 1))
        return Math.floor(legume.preco * Math.pow(1.2, level - 1));
    };
    
    // Função para calcular preço de venda com base no level
    const getPrecoVenda = (legume) => {
        const level = getLegumeLevel(legume.id);
        // Preço de venda também aumenta 20% por level
        return Math.floor((legume.precoVenda || legume.preco) * Math.pow(1.2, level - 1));
    };
    
    // Função para plantar uma semente em uma posição
    const handlePlantSeed = (posicao) => {
        if (!selectedSeed) return; // Se não houver semente selecionada, não faz nada
        
        // Verifica se já existe um legume nessa posição
        const posicaoOcupada = legumesPlantados.some(l => l.posicao === posicao);
        if (posicaoOcupada) return; // Se a posição já estiver ocupada, não planta
        
        // Verifica se há sementes no inventário
        if (!inventory[selectedSeed.id] || inventory[selectedSeed.id] <= 0) return;
        
        // Adiciona o legume plantado com timestamp e level atual
        const legumeLevel = getLegumeLevel(selectedSeed.id);
        setLegumesPlantados([...legumesPlantados, { 
            ...selectedSeed, 
            posicao,
            plantadoEm: Date.now(),
            acelerado: false,
            legumeLevel: legumeLevel
        }]);
        
        // Reduz a quantidade no inventário
        setInventory({
            ...inventory,
            [selectedSeed.id]: inventory[selectedSeed.id] - 1
        });
        
        // Remove a seleção após plantar
        setSelectedSeed(null);
    };
    
    // Função para calcular tempo decorrido (considera aceleração 2x após regar)
    const getTempoDecorrido = (legume) => {
        if (!legume.plantadoEm) return legume.tempoCrescimento;
        
        if (legume.acelerado && legume.regadoEm) {
            // Tempo antes de regar (passa normal)
            const tempoAntesRegar = (legume.regadoEm - legume.plantadoEm) / 1000;
            // Tempo depois de regar (passa 2x mais rápido)
            const tempoDepoisRegar = ((Date.now() - legume.regadoEm) / 1000) * 2;
            return tempoAntesRegar + tempoDepoisRegar;
        } else {
            // Tempo normal (sem aceleração)
            return (Date.now() - legume.plantadoEm) / 1000;
        }
    };
    
    // Função para coletar um legume pronto (usar enxada)
    const handleHarvest = (posicao) => {
        const legume = legumesPlantados.find(l => l.posicao === posicao);
        if (!legume) return;
        
        // Verifica se está pronto (considera aceleração)
        const tempoDecorrido = getTempoDecorrido(legume);
        if (tempoDecorrido < legume.tempoCrescimento) return; // Se não está pronto, não pode colher
        
        // Adiciona dinheiro (usa preço de venda baseado no level do legume)
        const legumeLevel = legume.legumeLevel || 1;
        const precoBaseVenda = legume.precoVenda || legume.preco;
        const precoVenda = Math.floor(precoBaseVenda * Math.pow(1.2, legumeLevel - 1));
        setMoney(prev => prev + precoVenda);
        
        // Remove o legume
        setLegumesPlantados(prev => prev.filter(l => l.posicao !== posicao));
    };
    
    // Função para acelerar crescimento com balde (2x, apenas uma vez)
    const handleWater = (posicao) => {
        setLegumesPlantados(prev => prev.map(legume => {
            if (legume.posicao === posicao && !legume.acelerado) {
                // Marca como acelerado e salva o timestamp de quando foi regado
                // O tempo passa 2x mais rápido a partir desse momento
                return {
                    ...legume,
                    acelerado: true,
                    regadoEm: Date.now()
                };
            }
            return legume;
        }));
    };
    
    // Estado para forçar atualização do crescimento (atualiza a cada segundo)
    const [growthTick, setGrowthTick] = useState(0);
    
    // Função para comprar uma semente na loja
    const handleBuy = (legume) => {
        const precoCompra = getPrecoCompra(legume);
        // Verifica se tem dinheiro suficiente
        if (money < precoCompra) return;
        
        // Reduz o dinheiro
        setMoney(prev => prev - precoCompra);
        
        // Adiciona a semente ao inventário
        setInventory(prev => ({
            ...prev,
            [legume.id]: (prev[legume.id] || 0) + 1
        }));
    };
    
    // Estado para rastrear qual ferramenta está sendo arrastada
    const [draggingTool, setDraggingTool] = useState(null);
    
    // Estado para rastrear qual ferramenta está selecionada (mobile)
    const [selectedTool, setSelectedTool] = useState(null);
    
    // Atualiza o estado de crescimento dos legumes a cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setGrowthTick(prev => prev + 1);
        }, 1000); // Atualiza a cada segundo
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="farm-container">
            <Block 
                legumesPlantados={legumesPlantados} 
                onPlantSeed={handlePlantSeed}
                selectedSeed={selectedSeed}
                growthTick={growthTick}
                onHarvest={handleHarvest}
                onWater={handleWater}
                draggingTool={draggingTool}
                selectedTool={selectedTool}
            />
            <Menu 
                inventory={inventory} 
                onSelectSeed={setSelectedSeed}
                selectedSeed={selectedSeed}
                money={money}
                onBuy={handleBuy}
                legumeLevels={legumeLevels}
                onLevelUp={handleLevelUp}
                getLevelUpPrice={getLevelUpPrice}
                getLegumeLevel={getLegumeLevel}
                getPrecoCompra={getPrecoCompra}
            />
            <ToolBox 
                onDragStart={setDraggingTool} 
                onDragEnd={() => setDraggingTool(null)}
                selectedTool={selectedTool}
                onSelectTool={setSelectedTool}
            />
            <MoneyMenu money={money} />
        </div>
    )
}

export default Farm;