import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, AlertCircle, CheckCircle, Star } from 'lucide-react';
import Header from '../Components/Header';

const VCAssessment = () => {
  const navigate = useNavigate();
  
  // Timer state
  const [levelTimer, setLevelTimer] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  
  // Answers and marks tracking
  const [answers, setAnswers] = useState({});
  const [levelMarks, setLevelMarks] = useState({
    level1: { marks: 0, timeTaken: 0, correctCount: 0 },
    level2: { marks: 0, timeTaken: 0, correctCount: 0 },
    level3: { marks: 0, timeTaken: 0, correctCount: 0 }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Questions configuration
  const questions = [
    // Level 1
    {
      id: 1,
      level: 1,
      question: 'පහත හැඩතල හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage1.jpg'),
      options: ['වෘත්තයක්', 'ත්‍රිකෝණයක්', 'සමචතුරස්රයක්', 'වෙනත්'],
      correctAnswer: 0,
      marks: 1
    },
    {
      id: 2,
      level: 1,
      question: 'පහත හැඩතල හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage2.jpg'),
      options: ['වෘත්තයක්', 'ත්‍රිකෝණයක්', 'සමචතුරස්රයක්', 'වෙනත්'],
      correctAnswer: 1,
      marks: 1
    },
    {
      id: 3,
      level: 1,
      question: 'පහත හැඩතල හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage3.jpg'),
      options: ['වෘත්තයක්', 'ත්‍රිකෝණයක්', 'තරුවක්', 'වෙනත්'],
      correctAnswer: 2,
      marks: 1
    },
    // Level 2
    {
      id: 4,
      level: 2,
      question: 'පහත රූප හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage4.jpg'),
      options: ['බෝලයක්', 'කෝප්පයක්', 'සරුංගලයක්', 'වෙනත්'],
      correctAnswer: 1,
      marks: 2
    },
    {
      id: 5,
      level: 2,
      question: 'පහත රූප හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage5.jpg'),
      options: ['අතක්', 'කුරුල්ලෙක්', 'කකුලක්', 'වෙනත්'],
      correctAnswer: 0,
      marks: 2
    },
    {
      id: 6,
      level: 2,
      question: 'පහත රූප හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage6.jpg'),
      options: ['මුවෙක්', 'බල්ලෙක්', 'හරකෙක්', 'වෙනත්'],
      correctAnswer: 0,
      marks: 3
    },
    // Level 3
    {
      id: 7,
      level: 3,
      question: 'පහත අකුර හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage7.jpg'),
      options: ['ස', 'ත', 'ක', 'වෙනත්'],
      correctAnswer: 2,
      marks: 2
    },
    {
      id: 8,
      level: 3,
      question: 'පහත වචනය හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage8.jpg'),
      options: ['අක්කා', 'අම්මා', 'අයියා', 'වෙනත්'],
      correctAnswer: 1,
      marks: 2
    },
    {
      id: 9,
      level: 3,
      question: 'පහත වාක්‍යය හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage9.jpg'),
      options: [
        { type: 'image', src: require('../Assets/VisualC/vcoption1.jpg') },
        { type: 'image', src: require('../Assets/VisualC/vcoption2.jpg') }
      ],
      correctAnswer: 0,
      marks: 2
    },
    {
      id: 10,
      level: 3,
      question: 'පහත ඉලක්කම හදුනා ගන්න',
      image: require('../Assets/VisualC/vcimage10.jpg'),
      options: ['3', '9', '8', 'වෙනත්'],
      correctAnswer: 2,
      marks: 2
    }
  ];

  const currentQ = questions[currentQuestion - 1];

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLevelTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLevel]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  // Calculate level marks
  const calculateLevelMarks = () => {
    const levelQuestions = questions.filter(q => q.level === currentLevel);
    let totalMarks = 0;
    let correctCount = 0;

    levelQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        totalMarks += q.marks;
        correctCount++;
      }
    });

    // Time bonus: only if at least one correct answer
    if (correctCount > 0 && levelTimer <= 20) {
      if (currentLevel === 1) totalMarks += 2;
      if (currentLevel === 2) totalMarks += 3;
      if (currentLevel === 3) totalMarks += 2;
    }

    return { marks: totalMarks, timeTaken: levelTimer, correctCount };
  };

  // Handle next question/level
  const handleNext = () => {
    // Check if this is the last question of current level
    const levelQuestions = questions.filter(q => q.level === currentLevel);
    const currentLevelQuestionIndex = levelQuestions.findIndex(q => q.id === currentQ.id);

    if (currentLevelQuestionIndex === levelQuestions.length - 1) {
      // End of level - calculate marks
      const levelResults = calculateLevelMarks();
      setLevelMarks(prev => ({
        ...prev,
        [`level${currentLevel}`]: levelResults
      }));

      if (currentLevel < 3) {
        // Move to next level
        setCurrentLevel(prev => prev + 1);
        setCurrentQuestion(currentQuestion + 1);
        setLevelTimer(0);
      } else {
        // End of assessment - submit
        submitResults(levelResults);
      }
    } else {
      // Next question in same level
      setCurrentQuestion(prev => prev + 1);
    }
  };

  // Submit results to backend
  const submitResults = async (level3Results) => {
    setIsSubmitting(true);

    const finalLevelMarks = {
      ...levelMarks,
      level3: level3Results
    };

    const totalMarks = 
      finalLevelMarks.level1.marks +
      finalLevelMarks.level2.marks +
      finalLevelMarks.level3.marks;

    const payload = {
      'Time Taken(level1)': finalLevelMarks.level1.timeTaken,
      'marks(level1)': finalLevelMarks.level1.marks,
      'Time Taken(level2)': finalLevelMarks.level2.timeTaken,
      'marks(level2)': finalLevelMarks.level2.marks,
      'Time Taken(level3)': finalLevelMarks.level3.timeTaken,
      'marks(level3)': finalLevelMarks.level3.marks,
      'Total marks': totalMarks
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await fetch('http://localhost:5000/predict_vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      
      const resultsData = {
        ...result,
        levelMarks: finalLevelMarks,
        totalMarks: totalMarks
      };
      
      // Navigate with state using React Router
      navigate('/vcResults', { 
        state: resultsData,
        replace: true 
      });
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('ප්‍රතිඵල ඉදිරිපත් කිරීමේදී දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
      setIsSubmitting(false);
    }
  };

  // Check if answer is selected
  const isAnswered = answers[currentQ.id] !== undefined;

  return (
    <div>
      <Header/>
      <div>
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-4">
      {/* Timer - Top Right */}
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-3 border-4 border-purple-400 z-50">
        <div className="flex items-center space-x-2">
          <Timer className="w-6 h-6 text-purple-600" />
          <span className="text-2xl font-bold text-purple-700">{formatTime(levelTimer)}</span>
        </div>
        <p className="text-xs text-purple-600 text-center mt-1">මට්ටම {currentLevel}</p>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-lg p-4 shadow-lg border-4 border-blue-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-blue-700">
              මට්ටම {currentLevel} - ප්‍රශ්නය {currentQuestion}/10
            </span>
            <div className="flex space-x-2">
              {[1, 2, 3].map(level => (
                <div
                  key={level}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    level < currentLevel
                      ? 'bg-green-500'
                      : level === currentLevel
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                >
                  {level < currentLevel ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold">{level}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestion / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-purple-300">
          {/* Question Text */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
              <h2 className="text-2xl font-bold text-purple-700">{currentQ.question}</h2>
            </div>
          </div>

          {/* Question Image */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 border-4 border-blue-300">
              <img
                src={currentQ.image}
                alt={`Question ${currentQ.id}`}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] === index;
              
              // Check if option is an image object
              const isImageOption = typeof option === 'object' && option.type === 'image';

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`p-4 rounded-xl border-4 transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-300 to-emerald-300 border-green-500 shadow-lg'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {isImageOption ? (
                    <img
                      src={option.src}
                      alt={`Option ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-800">{option}</span>
                  )}
                  {isSelected && (
                    <div className="mt-2 flex justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">උත්තරයක් තෝරන්න</span>
            </div>
            <button
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
              className={`px-8 py-3 rounded-full text-white text-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
                !isAnswered || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isSubmitting ? (
                'ඉදිරිපත් කරමින්...'
              ) : currentQuestion === 10 ? (
                'අවසන් කරන්න 🎉'
              ) : currentQuestion === 3 || currentQuestion === 6 ? (
                'මීළඟ මට්ටම 🚀'
              ) : (
                'මීළඟ ප්‍රශ්නය ➡️'
              )}
            </button>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border-4 border-yellow-300">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
              <span className="text-lg font-bold text-purple-700">
                ඔබට හොඳින් කරන්න පුළුවන්! 💪
              </span>
              <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default VCAssessment;