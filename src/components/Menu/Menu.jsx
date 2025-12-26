import './Menu.css';
import Option from '../Option/Option';
import legumes from '../../data/legumes';
import { useState, useEffect } from 'react';

const Menu = ({ inventory = {}, onSelectSeed, selectedSeed, money = 0, onBuy, legumeLevels = {}, onLevelUp, getLevelUpPrice, getLegumeLevel, getPrecoCompra }) => {
    const [activeTab, setActiveTab] = useState('loja');
    const legumesOrdenados = [...legumes].sort((a, b) => a.preco - b.preco);
    
    const handleBuyClick = (legume) => {
        if (onBuy) {
            onBuy(legume);
        }
    };
    
    const renderLoja = () => {
        return legumesOrdenados.map((legume) => {
            const legumeLevel = getLegumeLevel ? getLegumeLevel(legume.id) : 1;
            const precoCompra = getPrecoCompra ? getPrecoCompra(legume) : legume.preco;
            const levelUpPrice = getLevelUpPrice ? getLevelUpPrice(legume.id) : 0;
            const canBuy = money >= precoCompra;
            const canLevelUp = money >= levelUpPrice;
            
            return (
                <Option 
                    key={legume.id}
                    nome={legume.nome} 
                    imagem={legume.imagem} 
                    preco={precoCompra}
                    level={legumeLevel}
                    canBuy={canBuy}
                    onClick={() => handleBuyClick(legume)}
                    showLevelUp={true}
                    canLevelUp={canLevelUp}
                    levelUpPrice={levelUpPrice}
                    onLevelUp={(e) => {
                        e.stopPropagation();
                        if (onLevelUp) onLevelUp(legume.id);
                    }}
                />
            );
        });
    };

    const handleSeedClick = (legume) => {
        if (onSelectSeed) {
            // Se já está selecionado, deseleciona. Caso contrário, seleciona
            if (selectedSeed && selectedSeed.id === legume.id) {
                onSelectSeed(null);
            } else {
                onSelectSeed(legume);
            }
        }
    };

    const renderMochila = () => {
        const sementesNaMochila = legumesOrdenados.filter(legume => {
            return inventory[legume.id] && inventory[legume.id] > 0;
        });

        if (sementesNaMochila.length === 0) {
            return (
                <div className="mochila-vazia">
                    <p>Mochila vazia</p>
                </div>
            );
        }

        return sementesNaMochila.map((legume) => {
            const isSelected = selectedSeed && selectedSeed.id === legume.id;
            const legumeLevel = getLegumeLevel ? getLegumeLevel(legume.id) : 1;
            return (
                <Option 
                    key={legume.id}
                    nome={legume.nome} 
                    imagem={legume.imagem} 
                    quantidade={inventory[legume.id]}
                    level={legumeLevel}
                    isSelected={isSelected}
                    onClick={() => handleSeedClick(legume)}
                />
            );
        });
    };
    
    return (
        <div className="menu-container">
            <div className="menu-tabs">
                    <button 
                        className={`menu-tab ${activeTab === 'loja' ? 'active' : ''}`}
                        onClick={() => setActiveTab('loja')}
                    >
                        Loja
                    </button>
                    <button 
                        className={`menu-tab ${activeTab === 'mochila' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mochila')}
                    >
                        Mochila
                    </button>
                </div>
                <div className="menu-content">
                    {activeTab === 'loja' ? renderLoja() : renderMochila()}
                </div>
            </div>
    )
}

export default Menu;