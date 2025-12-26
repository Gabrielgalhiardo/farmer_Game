import './ToolBox.css';
import { useState, useEffect } from 'react';
import baldeImg from '../../assets/images/toolbox/balde.png';
import enxadaImg from '../../assets/images/toolbox/enxada.png';

const ToolBox = ({ onDragStart, onDragEnd, selectedTool, onSelectTool }) => {
    const [draggingItem, setDraggingItem] = useState(null);
    
    // Detecta se é mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const handleToolClick = (toolType) => {
        if (isMobile && onSelectTool) {
            // Toggle: se já está selecionado, deseleciona. Caso contrário, seleciona
            if (selectedTool === toolType) {
                onSelectTool(null);
            } else {
                onSelectTool(toolType);
            }
        }
    };

    useEffect(() => {
        if (draggingItem) {
            document.body.classList.add('dragging-tool');
            
            // Permite drop em qualquer lugar para evitar cursor "not-allowed"
            const handleDragOver = (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            };
            
            const handleDrop = (e) => {
                e.preventDefault();
            };
            
            document.body.addEventListener('dragover', handleDragOver);
            document.body.addEventListener('drop', handleDrop);
            
            return () => {
                document.body.classList.remove('dragging-tool');
                document.body.removeEventListener('dragover', handleDragOver);
                document.body.removeEventListener('drop', handleDrop);
            };
        } else {
            document.body.classList.remove('dragging-tool');
        }
    }, [draggingItem]);

    const handleDragStart = (e, itemType) => {
        setDraggingItem(itemType);
        if (onDragStart) {
            onDragStart(itemType);
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('text/plain', itemType);
        
        // Cria um elemento com apenas a imagem da ferramenta (sem o fundo)
        const dragImage = document.createElement('div');
        dragImage.style.width = '60px';
        dragImage.style.height = '60px';
        dragImage.style.backgroundImage = `url(${itemType === 'balde' ? baldeImg : enxadaImg})`;
        dragImage.style.backgroundSize = 'contain';
        dragImage.style.backgroundPosition = 'center';
        dragImage.style.backgroundRepeat = 'no-repeat';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        dragImage.style.left = '-1000px';
        dragImage.style.opacity = '1';
        dragImage.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))';
        dragImage.style.pointerEvents = 'none';
        
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 30, 30);
        
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);
    };

    const handleDrag = (e) => {
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault();
    };

    const handleDragEnd = () => {
        setDraggingItem(null);
        if (onDragEnd) {
            onDragEnd();
        }
    };

    return (
        <div className="toolbox-container">
            <div 
                className={`toolbox-item toolbox-item-balde ${draggingItem === 'balde' ? 'dragging' : ''} ${selectedTool === 'balde' ? 'selected' : ''}`}
                title={isMobile ? "Balde (Toque para selecionar)" : "Balde"}
                draggable={!isMobile ? "true" : "false"}
                onClick={() => handleToolClick('balde')}
                onDragStart={(e) => !isMobile && handleDragStart(e, 'balde')}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            ></div>
            <div 
                className={`toolbox-item toolbox-item-enxada ${draggingItem === 'enxada' ? 'dragging' : ''} ${selectedTool === 'enxada' ? 'selected' : ''}`}
                title={isMobile ? "Enxada (Toque para selecionar)" : "Enxada"}
                draggable={!isMobile ? "true" : "false"}
                onClick={() => handleToolClick('enxada')}
                onDragStart={(e) => !isMobile && handleDragStart(e, 'enxada')}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            ></div>
        </div>
    )
}

export default ToolBox;
