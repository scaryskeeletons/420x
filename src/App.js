import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSpring, animated, config } from 'react-spring';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaChartBar } from "react-icons/fa";


const DOGE_COLORS = {
  primary: '#CB9800',    // Doge fur color
  secondary: '#B59D26',  // Darker sandy color
  accent: '#FFD700',     // Gold
  text: '#000000',       // Black
  background: '#F4A460'  // Sandy brown
};

const generateDogeShades = () => {
  const baseColor = parseInt(DOGE_COLORS.primary.slice(1), 16);
  const shades = [];
  for (let i = 0; i < 20; i++) {
    const shade = Math.max(0, Math.min(255, (baseColor & 0xFF) + (i - 10) * 10));
    const color = `#${(shade | (shade << 8) | (shade << 16)).toString(16).padStart(6, '0')}`;
    shades.push(color);
  }
  return shades;
};

const DOGE_SHADES = generateDogeShades();

const moveDoge = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -400px 0;
  }
`;

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const BackgroundGif = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('./doge.gif');
  background-repeat: repeat;
  background-size: 100px 100px;
  animation: ${moveDoge} 10s linear infinite;
  transition: background-color 0.5s ease;
  z-index: 1;
`;

const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Card = styled(animated.div)`
  background: rgba(203, 152, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(139, 69, 19, 0.37);
  border: 1px solid rgba(255, 215, 0, 0.18);
  width: 90%;
  max-width: 400px;
  text-align: center;
  color: ${DOGE_COLORS.text};
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${DOGE_COLORS.primary};
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: ${DOGE_COLORS.secondary};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const ContractAddressInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 215, 0, 0.2);
  border: none;
  border-radius: 5px;
  font-size: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const BuyButton = styled(animated.button)`
  background-color: ${DOGE_COLORS.accent};
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
              inset 0 -2px 5px rgba(0, 0, 0, 0.1),
              inset 0 2px 5px rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15),
                inset 0 -2px 5px rgba(0, 0, 0, 0.2),
                inset 0 2px 5px rgba(255, 255, 255, 0.7);
  }
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialButton = styled.a`
  background-color: ${DOGE_COLORS.primary};
  color: ${DOGE_COLORS.text};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
              inset 0 -1px 3px rgba(0, 0, 0, 0.1),
              inset 0 1px 3px rgba(255, 255, 255, 0.5);

  &:hover {
    background-color: ${DOGE_COLORS.accent};
    color: ${DOGE_COLORS.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15),
                inset 0 -1px 3px rgba(0, 0, 0, 0.2),
                inset 0 1px 3px rgba(255, 255, 255, 0.7);
  }
`;

const CopyPopup = styled(animated.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${DOGE_COLORS.secondary};
  color: ${DOGE_COLORS.text};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  z-index: 10;
`;

function App() {
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [currentShadeIndex, setCurrentShadeIndex] = useState(0);
  const contractAddress = '7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShadeIndex((prevIndex) => (prevIndex + 1) % DOGE_SHADES.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const cardProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.wobbly,
  });

  const buttonProps = useSpring({
    from: { transform: 'scale(1)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.05)' });
        await next({ transform: 'scale(1)' });
      }
    },
    config: { duration: 1000 },
  });

  const popupProps = useSpring({
    opacity: showCopyPopup ? 1 : 0,
    transform: showCopyPopup ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
    config: { tension: 300, friction: 10 },
  });

  const handleCopy = () => {
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 2000);
  };

  const handleBuyClick = () => {
    window.open('https://pump.fun/Hr2F4H15pS3Gprx2QuYkBhVfW7nvoaVtqBnQwFSupump', '_blank', 'noopener,noreferrer');
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const currentShade = DOGE_SHADES[currentShadeIndex];
  const contrastColor = getContrastColor(currentShade);

  return (
    <AppContainer>
      <BackgroundGif style={{ backgroundColor: currentShade }} />
      <ContentContainer>
        <Card style={cardProps}>
          <Title style={{ textShadow: `3px 3px 6px ${contrastColor}80` }}>420X DOGE</Title>
          <Subtitle style={{ textShadow: `2px 2px 4px ${contrastColor}80`, color: contrastColor }}>Much Gains, Very Solana</Subtitle>
          <CopyToClipboard text={contractAddress} onCopy={handleCopy}>
            <ContractAddressInput 
              value={contractAddress}
              readOnly
              placeholder="Click to copy contract address"
              style={{
                color: contrastColor,
                textShadow: `1px 1px 2px ${currentShade}`,
                border: `1px solid ${contrastColor}`
              }}
            />
          </CopyToClipboard>
          <BuyButton 
            onClick={handleBuyClick} 
            style={{
              ...buttonProps,
              backgroundColor: currentShade,
              color: contrastColor,
              textShadow: `1px 1px 2px ${currentShade}`,
              border: `1px solid ${contrastColor}`
            }}
          >
            Buy 420X DOGE
          </BuyButton>
          <SocialButtons>
            <SocialButton href="https://t.me/doge420x" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: currentShade, color: contrastColor }}>
              <FaTelegramPlane />
            </SocialButton>
            <SocialButton href="https://x.com/doge420x" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: currentShade, color: contrastColor }}>
              <FaXTwitter />
            </SocialButton>
            <SocialButton href="https://pump.fun/Hr2F4H15pS3Gprx2QuYkBhVfW7nvoaVtqBnQwFSupump" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: currentShade, color: contrastColor }}>
              <FaChartBar />
            </SocialButton>
          </SocialButtons>
        </Card>
      </ContentContainer>
      <CopyPopup style={popupProps}>Copied CA to Clipboard</CopyPopup>
    </AppContainer>
  );
}

export default App;