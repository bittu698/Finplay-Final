import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Users, Undo2, Lightbulb, Settings, Target, Trophy, Coins, Loader2, Globe } from 'lucide-react';

const INDIAN_NAMES = ['Rahul Sharma', 'Priya Das', 'Amit Kumar', 'Neha Singh', 'Vikram Malhotra', 'Riya Kapoor', 'Aditya Rao', 'Kavya Tiwari'];

// Sound Effects
const playSound = (type: 'place' | 'win') => {
  try {
    const audio = new Audio(
      type === 'place' 
        ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' 
        : 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'
    );
    audio.volume = type === 'place' ? 0.5 : 0.8;
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (e) {
    console.log('Audio not supported');
  }
};

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: -20, 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
            rotate: 0,
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
            x: `calc(${Math.random() * 100}vw + ${Math.random() * 100 - 50}px)`,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2.5 + Math.random() * 2,
            ease: "linear",
            delay: Math.random() * 0.2
          }}
          className={`absolute w-3 h-3 ${Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'} ${
            ['bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500', 'bg-blue-500'][Math.floor(Math.random() * 5)]
          }`}
        />
      ))}
    </div>
  );
};

const getBestFallbackMove = (currentBoard: any[]) => {
  const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
  if (emptyIndices.length === 0) return -1;

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // 1. Try to win
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const line = [currentBoard[a], currentBoard[b], currentBoard[c]];
    if (line.filter(v => v === 'X').length === 2 && line.filter(v => v === null).length === 1) {
      return lines[i][line.indexOf(null)];
    }
  }

  // 2. Try to block
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const line = [currentBoard[a], currentBoard[b], currentBoard[c]];
    if (line.filter(v => v === 'O').length === 2 && line.filter(v => v === null).length === 1) {
      return lines[i][line.indexOf(null)];
    }
  }

  // 3. Take center
  if (currentBoard[4] === null) return 4;

  // 4. Random empty corner
  const corners = [0, 2, 6, 8].filter(idx => currentBoard[idx] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Random empty side
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};

const BoardCell = memo(({ cell, index, onClick, disabled, gameState }: any) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    onClick={() => {
      if (!disabled && navigator.vibrate) navigator.vibrate(30);
      onClick(index);
    }}
    disabled={disabled}
    className={`rounded-2xl flex items-center justify-center text-5xl font-black transition-all border-2 shadow-sm ${
      cell === 'X' ? 'text-emerald-400 border-emerald-200 bg-emerald-50/80 backdrop-blur-sm [text-shadow:0_0_15px_rgba(52,211,153,0.8)]' : 
      cell === 'O' ? 'text-rose-500 border-rose-200 bg-rose-50/80 backdrop-blur-sm [text-shadow:0_0_15px_rgba(244,63,94,0.8)]' : 
      'border-white/50 hover:border-purple-300 hover:bg-purple-50/50 bg-white/60 backdrop-blur-md'
    } ${!disabled ? 'cursor-pointer' : 'cursor-default'}
      ${gameState === 'end' && !cell ? 'opacity-30' : ''}
    `}
  >
    {cell && (
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {cell}
      </motion.span>
    )}
  </motion.button>
));

export function Play({ data, addCoins, deductCoins, updateStats, navigateTo, setLastRewardedAdTime }: any) {
  const [gameState, setGameState] = useState('start'); // start, playing, thinking, end
  const [gameMode, setGameMode] = useState<'computer' | 'friend' | 'online'>('computer');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [opponentName, setOpponentName] = useState('');
  const [winner, setWinner] = useState<string | null>(null); // 'X', 'O', 'Draw', null
  const [timeLeft, setTimeLeft] = useState(15);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardCooldown, setRewardCooldown] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const startGame = (mode: 'computer' | 'friend' | 'online') => {
    if (data.coins < 20) {
      alert('Not enough coins! You need 20 coins to play.');
      return;
    }
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    deductCoins(20, 'Match Entry Fee');
    setGameMode(mode);
    setOpponentName(mode === 'friend' ? 'Player 2' : INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)]);
    
    if (mode === 'online') {
      setGameState('matching');
      setTimeout(() => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setGameState('playing');
        setTimeLeft(15);
        setRewardClaimed(false);
        setIsWatchingAd(false);
        setRewardCooldown(0);
      }, 1800);
    } else {
      setBoard(Array(9).fill(null));
      setIsPlayerTurn(true);
      setWinner(null);
      setGameState('playing');
      setTimeLeft(15);
      setRewardClaimed(false);
      setIsWatchingAd(false);
      setRewardCooldown(0);
    }
  };

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (gameState !== 'playing' || board[index]) return;
    if ((gameMode === 'computer' || gameMode === 'online') && !isPlayerTurn) return;
    
    playSound('place');
    
    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? 'O' : 'X';
    setBoard(newBoard);
    
    const win = checkWinner(newBoard);
    if (win) {
      endGame(win);
    } else {
      if (gameMode === 'computer' || gameMode === 'online') {
        setIsPlayerTurn(false);
        setGameState('thinking');
      } else {
        setIsPlayerTurn(!isPlayerTurn);
        setTimeLeft(15);
      }
    }
  };

  const makeAIMove = useCallback(async () => {
    const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
    if (emptyIndices.length === 0) return;

    let moveIndex = getBestFallbackMove(board); // Smart AI Move

    // Ensure a minimum delay. Online mode has a longer delay to simulate human thinking.
    // Computer mode has a short delay for smooth gameplay.
    const minDelay = gameMode === 'online' ? 1500 + Math.random() * 1000 : 500;
    
    await new Promise(resolve => setTimeout(resolve, minDelay));

    const newBoard = [...board];
    newBoard[moveIndex] = 'X';
    setBoard(newBoard);
    
    playSound('place');
    
    const win = checkWinner(newBoard);
    if (win) {
      endGame(win);
    } else {
      setIsPlayerTurn(true);
      setGameState('playing');
      setTimeLeft(15);
    }
  }, [board, gameMode]);

  useEffect(() => {
    if (gameState === 'thinking' && (gameMode === 'computer' || gameMode === 'online')) {
      makeAIMove();
    }
  }, [gameState, makeAIMove, gameMode]);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing') {
      if (gameMode === 'friend' || isPlayerTurn) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [gameState, isPlayerTurn, gameMode]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') {
      if ((gameMode === 'computer' || gameMode === 'online') && isPlayerTurn) {
        endGame('X');
      } else if (gameMode === 'friend') {
        endGame(isPlayerTurn ? 'X' : 'O');
      }
    }
  }, [timeLeft, gameState, isPlayerTurn, gameMode]);

  const endGame = (result: string) => {
    setWinner(result);
    setGameState('end');
    updateStats(result === 'O');
    
    if (result === 'O') {
      addCoins(30, 'Match Win');
    }
    
    if (result === 'O' || result === 'X') {
      playSound('win');
    }
    
    if (result === 'O' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    } else if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isWatchingAd) {
      timer = setInterval(() => {
        setRewardCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWatchingAd]);

  useEffect(() => {
    if (isWatchingAd && rewardCooldown <= 0) {
      setIsWatchingAd(false);
      addCoins(20, 'Extra Ad Reward');
      setRewardClaimed(true);
    }
  }, [isWatchingAd, rewardCooldown, addCoins]);

  const handleRewardAd = () => {
    setIsWatchingAd(true);
    setRewardCooldown(3);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#F0F4F8] to-purple-50/50">
      {/* Background Enhancement */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-300/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/20 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-300/20 blur-[80px] animate-[pulse_12s_ease-in-out_infinite]"></div>
      </div>

      {winner === 'O' && <Confetti />}

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-md mx-auto relative z-10"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="w-full p-8 text-center bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[24px] border border-white/50"
            >
              <h2 className="text-4xl font-black mb-8 tracking-[0.2em] uppercase bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.2)]">
                Tic Tac Toe
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100/50 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                  <Target size={20} className="text-purple-500 mb-1" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Entry</p>
                  <p className="text-sm font-black text-purple-700">20</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100/50 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                  <Trophy size={20} className="text-amber-500 mb-1" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Reward</p>
                  <p className="text-sm font-black text-amber-600">30</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/50 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                  <svg viewBox="0 0 100 100" className="w-6 h-6 mb-1 drop-shadow-sm">
                    <circle cx="50" cy="50" r="50" fill="#F59E0B" />
                    <circle cx="50" cy="50" r="46" fill="#FDE047" />
                    <circle cx="50" cy="50" r="34" fill="#FACC15" />
                    <text x="50" y="68" fontSize="52" fontFamily="Arial, sans-serif" fontWeight="900" fill="#F59E0B" textAnchor="middle">$</text>
                  </svg>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Balance</p>
                  <motion.p 
                    key={data.coins}
                    initial={{ scale: 1.5, color: '#10b981' }}
                    animate={{ scale: 1, color: '#059669' }}
                    className="text-sm font-black text-emerald-600"
                  >
                    {data.coins}
                  </motion.p>
                </div>
              </div>

              <div className="space-y-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame('computer')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_10px_25px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Bot size={24} className="relative z-10" />
                  <span className="text-lg relative z-10">Vs Computer</span>
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame('friend')}
                  className="w-full relative p-[2px] rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-[14px] flex items-center justify-center space-x-3 text-purple-600 group-hover:bg-white/80 transition-colors">
                    <Users size={24} />
                    <span className="text-lg">Vs Friend</span>
                  </div>
                </motion.button>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame('online')}
                  className="w-full relative p-[2px] rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-[14px] flex items-center justify-center space-x-3 text-blue-600 group-hover:bg-white/80 transition-colors">
                    <Globe size={24} />
                    <span className="text-lg">Vs Online</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {gameState === 'matching' && (
          <motion.div 
            key="matching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-md mx-auto relative z-10"
          >
            <div className="w-full p-8 text-center bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[24px] border border-white/50 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-100 to-blue-50 p-1 mb-6 relative shadow-inner">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black text-purple-500 shadow-sm">
                  {opponentName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                  <Loader2 size={20} className="text-purple-500 animate-spin" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">Opponent Found!</h3>
              <p className="text-slate-500 font-medium mb-6">Playing vs <span className="text-purple-600 font-bold">{opponentName}</span></p>
              
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
                <Loader2 size={16} className="animate-spin" />
                <span>Setting up match...</span>
              </div>
            </div>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'thinking' || gameState === 'end') && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center pt-6 pb-24 px-4 max-w-md mx-auto min-h-screen relative z-10"
          >
            <div className="w-full flex justify-center items-center mb-8 space-x-8 mt-4 bg-white/60 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white/50">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-black text-rose-500 mb-2 [text-shadow:0_0_15px_rgba(244,63,94,0.8)]">O</div>
                <p className="text-sm text-slate-600 font-bold">Player</p>
              </div>
              
              <div className="text-2xl font-black text-slate-300">VS</div>
              
              <div className="flex flex-col items-center">
                <div className="text-5xl font-black text-emerald-400 mb-2 [text-shadow:0_0_15px_rgba(52,211,153,0.8)]">X</div>
                <p className="text-sm text-slate-600 font-bold">{opponentName}</p>
              </div>
            </div>

            {gameState === 'playing' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex space-x-2"
              >
                <div className={`w-12 h-2 rounded-full transition-all duration-300 ${isPlayerTurn ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] scale-110' : 'bg-slate-200/50'}`}></div>
                <div className={`w-12 h-2 rounded-full transition-all duration-300 ${!isPlayerTurn ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] scale-110' : 'bg-slate-200/50'}`}></div>
              </motion.div>
            )}
            
            {gameState === 'thinking' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-slate-500 font-bold animate-pulse bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm"
              >
                {opponentName} is thinking...
              </motion.div>
            )}

            {gameState === 'end' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-6 px-6 py-2 rounded-full font-bold border-2 shadow-sm ${
                winner === 'X' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-600 [text-shadow:0_0_8px_rgba(52,211,153,0.4)]' : 
                winner === 'O' ? 'bg-rose-50/90 border-rose-200 text-rose-600 [text-shadow:0_0_8px_rgba(244,63,94,0.4)]' : 
                'bg-slate-100/90 border-slate-200 text-slate-600'
              }`}>
                {winner === 'O' ? 'You Won! 🎉' : winner === 'X' ? 'You Lost! 😢' : 'Match Draw! 🤝'}
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-2 w-full max-w-[320px] aspect-square mb-8 border-2 border-white/60 rounded-[24px] p-2 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
              {board.map((cell, index) => (
                <BoardCell
                  key={index}
                  index={index}
                  cell={cell}
                  onClick={handlePlayerMove}
                  disabled={gameState !== 'playing' || ((gameMode === 'computer' || gameMode === 'online') && !isPlayerTurn) || cell !== null}
                  gameState={gameState}
                />
              ))}
            </div>

            {gameState === 'playing' && (
              <div className="flex justify-center space-x-6 mt-4">
                <button className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-sm flex items-center justify-center text-slate-500 hover:text-purple-600 hover:border-purple-200 hover:shadow-md active:scale-95 transition-all">
                  <Undo2 size={24} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-sm flex items-center justify-center text-slate-500 hover:text-purple-600 hover:border-purple-200 hover:shadow-md active:scale-95 transition-all">
                  <Lightbulb size={24} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border border-white shadow-sm flex items-center justify-center text-slate-500 hover:text-purple-600 hover:border-purple-200 hover:shadow-md active:scale-95 transition-all">
                  <Settings size={24} />
                </button>
              </div>
            )}

            <AnimatePresence>
              {gameState === 'end' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-4"
                >
                  {winner === 'O' && !rewardClaimed && (
                    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 text-center mb-4 shadow-sm">
                      <p className="text-emerald-600 font-bold mb-3">You won 30 Coins! 🎉</p>
                      <button 
                        onClick={handleRewardAd}
                        disabled={isWatchingAd}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                          isWatchingAd ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg active:scale-95'
                        }`}
                      >
                        <span>Watch Ad for +20 Extra 📺</span>
                        {isWatchingAd && <span>({rewardCooldown}s)</span>}
                      </button>
                      <div id="ad-rewarded" className="hidden"></div>
                    </div>
                  )}
                  
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame(gameMode)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_10px_25px_rgba(147,51,234,0.4)] transition-all"
                  >
                    Play Again
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameState('start')}
                    className="w-full bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-600 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-colors shadow-sm"
                  >
                    Change Mode
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('home')}
                    className="w-full bg-transparent text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-100/50 transition-colors"
                  >
                    Back to Home
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
