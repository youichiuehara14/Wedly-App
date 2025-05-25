import React, { useContext, useState } from 'react';
import { Context } from '../Context';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIPage = () => {
  const { activeBoardObject, tasksPerBoard } = useContext(Context);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_AI_API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);

  const handleSend = async () => {
    if (!activeBoardObject || Object.keys(activeBoardObject).length === 0) {
      alert('Please select a board first.');
      return;
    }

    setLoading(true);

    const { totalBudget, totalSpent, totalRemaining, weddingDate } = activeBoardObject;
    const tasks = tasksPerBoard?.tasks || [];

    const formattedTasks = tasks
      .map((task) => {
        return `• ${task.title} (${task.category || 'Un-categorized'}) - Cost: Php ${
          task.cost || 0
        }`;
      })
      .join('\n');

    const prompt = `
      You are a professional wedding planning assistant.
      
      Your job is to give brief and clear suggestions based only on:
      - The couple's budget
      - Their tasks
      - The wedding date
      
      Do not mention anything about guests or the number of guests.
      
      Wedding Details:
      - Total Budget: Php ${totalBudget || 0}
      - Total Spent: Php ${totalSpent || 0}
      - Remaining Budget: Php ${totalRemaining || 0}
      - Wedding Date: ${new Date(weddingDate).toDateString()}
      
      Task List:
      ${formattedTasks}
      
      Your response must strictly follow this format:
      
      --------------------
      💡 Budget Tips:
      - [Tip 1]
      - [Tip 2]
      - [Tip 3]
      
      📅 Timeline Tips:
      - [Tip 1]
      - [Tip 2]
      
      🧾 Task Suggestions:
      - [Tip 1]
      - [Tip 2]
      --------------------
      
      Based on the information above, provide practical suggestions to help the couple stay on budget and on schedule. Keep your advice short, specific, and actionable. Always follow the visual format exactly, even if some sections are shorter or empty.
      `;

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setAiResponse(text);
      console.log('AI response:', text);
    } catch (err) {
      console.error('AI error:', err);
      setAiResponse('An error occurred while getting suggestions.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-full w-full text-black p-4 flex justify-center items-center">
      <div className="h-[80vh] w-[80vw] flex flex-col rounded-3xl shadow-xl bg-white p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">💡 AI Suggestions</h1>

        <div className="flex-1 overflow-y-auto rounded-lg p-4 border border-gray-300 mb-4 text-base whitespace-pre-line">
          {loading ? (
            <p className="text-gray-500 text-center">Generating suggestions...</p>
          ) : aiResponse ? (
            <p>{aiResponse}</p>
          ) : (
            <p className="text-gray-500 text-center">
              Click the button to get AI suggestions for your wedding plan.
              <br />
              Note: Make sure that you have selected a board first.
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            {loading ? 'Analyzing...' : 'Get AI Suggestion'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
