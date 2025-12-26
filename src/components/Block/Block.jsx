import './Block.css';
import { useRef, useEffect } from 'react';

const Block = ({ legumesPlantados = [], onPlantSeed, selectedSeed, growthTick, onHarvest, onWater, draggingTool }) => {
    // Função para calcular tempo decorrido (considera aceleração 2x após regar)
    const getTempoDecorrido = (legume) => {
        if (!legume.plantadoEm) return legume.tempoCrescimento; // Se não tem timestamp, assume que está pronto
        
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
    
    // Função para calcular se o legume está pronto
    const isReady = (legume) => {
        if (!legume.plantadoEm) return true; // Se não tem timestamp, assume que está pronto (legados)
        const tempoDecorrido = getTempoDecorrido(legume);
        return tempoDecorrido >= legume.tempoCrescimento;
    };
    
    // Função para calcular progresso do crescimento (0 a 1)
    const getGrowthProgress = (legume) => {
        if (!legume.plantadoEm) return 1; // Se não tem timestamp, assume que está pronto
        const tempoDecorrido = getTempoDecorrido(legume);
        const progresso = Math.min(tempoDecorrido / legume.tempoCrescimento, 1);
        return progresso;
    };
    
    // Cria um array com 16 posições (grid 4x4)
    const totalPositions = 16;
    const positions = Array.from({ length: totalPositions }, (_, index) => {
        const legumeNaPosicao = legumesPlantados.find(l => l.posicao === index);
        return {
            posicao: index,
            legume: legumeNaPosicao || null
        };
    });

    const handleCellClick = (posicao, legume) => {
        // Se a célula já tem um legume, não faz nada no click (usa drop para ferramentas)
        if (legume) return;
        
        // Se não há semente selecionada, não faz nada
        if (!selectedSeed) return;
        
        // Planta a semente
        if (onPlantSeed) {
            onPlantSeed(posicao);
        }
    };
    
    // Rastreia quais posições já foram processadas para evitar múltiplas execuções
    const processedPositionsRef = useRef(new Set());
    
    // Limpa as posições processadas quando a ferramenta para de ser arrastada
    useEffect(() => {
        if (!draggingTool) {
            processedPositionsRef.current = new Set();
        }
    }, [draggingTool]);
    
    const handleDragOver = (e, posicao, legume) => {
        // Só processa se tiver um legume na posição e uma ferramenta sendo arrastada
        if (!legume || !draggingTool) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Executa a ação diretamente ao passar sobre o legume (apenas uma vez por posição por sessão de drag)
        if (!processedPositionsRef.current.has(posicao)) {
            if (draggingTool === 'enxada') {
                // Coleta o legume se estiver pronto
                if (isReady(legume) && onHarvest) {
                    processedPositionsRef.current.add(posicao);
                    onHarvest(posicao);
                }
            } else if (draggingTool === 'balde') {
                // Acelera o crescimento (apenas se ainda não foi acelerado)
                if (!legume.acelerado && !isReady(legume) && onWater) {
                    processedPositionsRef.current.add(posicao);
                    onWater(posicao);
                }
            }
        }
    };
    
    const handleDrop = (e) => {
        // Previne o comportamento padrão, mas não faz nada porque já processamos no dragOver
        e.preventDefault();
    };

    return (
        <div className="block-container">
            <div className="block-grid">
                {positions.map(({ posicao, legume }) => {
                    const pronto = legume ? isReady(legume) : false;
                    const progresso = legume ? getGrowthProgress(legume) : 0;
                    const tempoDecorrido = legume ? getTempoDecorrido(legume) : 0;
                    const tempoRestante = legume ? Math.max(0, legume.tempoCrescimento - tempoDecorrido) : 0;
                    
                    return (
                        <div 
                            key={posicao}
                            className={`block-cell ${legume ? (pronto ? 'legume-plantado ready' : 'legume-plantado growing') : 'empty'} ${selectedSeed && !legume ? 'can-plant' : ''}`}
                            style={legume ? {
                                backgroundImage: `url(${legume.imagem})`,
                                opacity: pronto ? 1 : 0.5 + (progresso * 0.5) // Vai de 0.5 a 1.0
                            } : {}}
                            title={legume ? (pronto ? `${legume.nome} - Pronto para colher! (Passe a enxada)` : `${legume.nome} - Crescendo... (${Math.ceil(tempoRestante)}s) ${legume.acelerado ? '[Acelerado]' : '[Passe o balde para acelerar]'}`) : selectedSeed ? `Clique para plantar ${selectedSeed.nome}` : 'Posição vazia'}
                            onClick={() => handleCellClick(posicao, legume)}
                            onDragOver={(e) => handleDragOver(e, posicao, legume)}
                            onDrop={(e) => handleDrop(e, posicao, legume)}
                        >
                            {legume && !pronto && (
                                <div className="growth-indicator">
                                    <div className="growth-bar" style={{ width: `${progresso * 100}%` }}></div>
                                </div>
                            )}
                            {legume && pronto && (
                                <div className="ready-indicator">✓</div>
                            )}
                            {legume && legume.acelerado && (
                                <div className="watered-indicator">💧</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Block;