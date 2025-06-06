import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
export const FAQPage = () => {
    const [faqList, setfaqList] = useState([
        {
            id: 1,
            question: "Who can donate blood?",
            answer: "People aged 18-60, weighing over 45kg, healthy and free from infectious diseases can donate blood."
        },
        {
            id: 2,
            question: "Is blood donation painful?",
            answer: "Blood donation only causes mild pain when the needle enters the skin, similar to a routine blood test."
        },
        {
            id: 3,
            question: "How much blood is taken per donation?",
            answer: "Typically, each donation ranges from 250ml to 450ml of blood, depending on the donor's weight."
        },
        {
            id: 4,
            question: "How long until I can donate again?",
            answer: "Men can donate again after 3 months, women after 4 months."
        },
        {
            id: 5,
            question: "What should I prepare before donating?",
            answer: "Get enough sleep, eat a full breakfast, avoid alcohol, and bring your ID card."
        }
    ])

    const [openFAQs, setOpenFAQs] = useState([]);

    const toggleFAQ = (id) => {
        setOpenFAQs(openFAQs.includes(id)
            ? openFAQs.filter(faqId => faqId !== id)
            : [...openFAQs, id]
        );
    };

    return (
        <div className="mx-auto px-4 py-8">
            <h1 className="text-center text-2xl pb-8 text-[#D32F2F]">Frequently Asked Questions</h1>
            <div className="max-w-4xl mx-auto space-y-4">
                {faqList.map((item) => (
                    <div key={item.id} className="w-full border rounded-lg shadow-sm">
                        <button
                            className="w-full flex justify-between p-4 bg-gray-50 hover:bg-gray-100"
                            onClick={() => toggleFAQ(item.id)}
                        >
                            <h2 className="font-semibold">{item.question}</h2>
                            <AiFillCaretDown className={`
                                transform transition ${openFAQs.includes(item.id) ? 'rotate-180' : ''} text-gray-400`} />
                        </button>
                        {openFAQs.includes(item.id) && (
                            <div className="p-4">
                                <p className="text-black">{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}