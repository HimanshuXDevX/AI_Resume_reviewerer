import React from 'react'
import ScoreGauge from './ScoreGauge'
import ScoreBadge from './ScoreBadge'

interface Feedback {
  overallScore: number;
  toneAndStyle: { score: number };
  content: { score: number };
  structure: { score: number };
  skills: { score: number };
}

// Category component with enhanced visibility for Dark Mode AND smaller size
const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70 ? 'text-green-400' : score > 49 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className='resume-summary p-2'>
      <div className='category'>
        <div className='flex flex-row gap-1 items-center justify-center'>
          <p className='text-lg font-bold text-white'>{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className='text-xl font-semibold flex gap-1'>
          <span className={textColor}>{score}</span>
          <span className='text-white'>/ 100</span>
        </p>
      </div>
    </div>
  )
}

// Summary component with enhanced visibility for Dark Mode AND smaller size
const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className='bg-gray-800 rounded-xl shadow-xl shadow-gray-900'>
      <div className='flex flex-row items-center p-3 gap-4 border-b border-gray-700'>
        <ScoreGauge score={feedback.overallScore} />
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-extrabold text-white'>Your Resume Score</h2>
          <p className='text-sm text-gray-400'>
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>
      <Category title='Tone & Style' score={feedback.toneAndStyle.score} />
      <Category title='Content' score={feedback.content.score} />
      <Category title='Structure' score={feedback.structure.score} />
      <Category title='Skills' score={feedback.skills.score} />
    </div>
  )
}

export default Summary
