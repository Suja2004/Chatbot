import React, { useState, useEffect } from "react";
import './Therapy.css';
import Navbar from "./Navbar";

const Therapy = () => {
    const [therapyScript, setTherapyScript] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeSessionIndex, setActiveSessionIndex] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    const therapySessions = [
        {
            title: "PTSD Therapy Session 1",
            description:
                "Practice mindfulness and Cognitive Behavioral Therapy (CBT) techniques to manage PTSD symptoms. This session will take about 10-15 minutes.",
            script: `Welcome to your PTSD therapy session. In this session, we'll be practicing mindfulness and Cognitive Behavioral Therapy (CBT) techniques to help you manage mild PTSD symptoms. This session will take about 10-15 minutes. Find a quiet place where you can relax.

Start by sitting comfortably. Take a deep breath in, hold for a few seconds, and then slowly exhale. Let’s repeat this a few times, focusing on the sensation of your breath entering and leaving your body. Feel your chest and belly rise and fall with each breath.

Now, let's focus on the present moment. Look around the room and name 5 things you can see. Notice the colors and shapes. Next, name 4 things you can touch. Feel their texture. This exercise helps you feel grounded in the here and now.

Think of a recent situation where you felt anxious or overwhelmed. Notice what thoughts come to mind. Are these thoughts based on facts or assumptions? Gently challenge them. Replace negative thoughts with a more balanced perspective. For example, instead of 'I can’t handle this,' try 'I have faced challenges before, and I can get through this too.'

Now, let’s repeat a positive affirmation: 'I am capable, and I have the strength to overcome challenges.' Say it out loud or in your mind. Let these words sink in as you take another deep breath.

Thank you for completing this session. Remember, practicing mindfulness and challenging negative thoughts regularly can help manage mild PTSD symptoms. Take your time as you transition back to your day.
`,
        },
        {
            title: "PTSD Therapy Session 2",
            description:
                "Focus on Trauma-Focused Cognitive Behavioral Therapy (TF-CBT) and Exposure Therapy to help manage PTSD symptoms. This session will take about 20-30 minutes.",
            script: `Welcome to your PTSD therapy session. In this session, we'll focus on Trauma-Focused Cognitive Behavioral Therapy (TF-CBT) and Exposure Therapy to help you manage moderate PTSD symptoms. This session will take about 20-30 minutes. Make sure you're in a comfortable, quiet space.

Let’s begin with a few deep breaths. Inhale deeply through your nose, hold for a moment, and then slowly exhale through your mouth. With each breath, feel your body becoming more relaxed. Take your time with this.

Think of a situation where you felt afraid or anxious. What thoughts crossed your mind at that moment? Now, let’s challenge those thoughts. Ask yourself: 'Are these thoughts based on facts?' 'Is there another way to look at this situation?' Replace any negative or irrational thoughts with more balanced and positive ones.

Next, we’ll take small steps towards confronting a memory that triggers your PTSD. Imagine the memory, but from a distance, like you're watching it on a screen. As you do, notice your feelings. It’s okay if you feel discomfort—just acknowledge it. Repeat this exercise until the intensity of your feelings lessens. You are safe now, and you’re in control of this process.

Take a moment to visualize a peaceful place where you feel safe and calm. It could be a real place or one you’ve created in your mind. Picture yourself there now, surrounded by peaceful sights and sounds. Focus on how relaxed you feel in this place.

Great job completing this session. Remember, gradual exposure to memories and challenging negative thoughts can reduce their power over time. Practice this technique as needed, and always reach out to a professional if you need support.
`,
        },
        {
            title: "PTSD Therapy Session 3",
            description:
                "Focus on Prolonged Exposure Therapy and Narrative Exposure Therapy to help manage  PTSD symptoms. This session will take about 20-30 minutes.",
            script: `Welcome to your PTSD therapy session. In this session, we'll be focusing on Prolonged Exposure Therapy and Narrative Exposure Therapy. This session will take about 20-30 minutes. Find a comfortable space where you can fully focus on yourself and this process.

Let’s begin with a deep breathing exercise. Breathe in slowly for 4 seconds, hold for 4, and exhale for 4. Continue this rhythm, allowing your body to relax with each breath. Feel your body becoming lighter as you release tension.

In this step, we will revisit a traumatic memory. Imagine yourself in the memory, but with the understanding that you are now safe. Start by describing the memory in detail—what happened, where you were, and how you felt. It’s important to remember that this is a controlled exercise, and you are safe now.

As you reflect on the memory, notice the emotions it triggers. Now, imagine you are telling your story from a place of strength. Focus on the ways you’ve survived and the lessons you’ve learned. You have the power to rewrite the narrative of this experience.

Take a moment to see the memory as part of your life story, not as something that defines you. You have faced challenges and continued to move forward. Remind yourself that you are resilient, and you are not defined by the trauma you’ve experienced.

Now, let’s end with a positive affirmation: 'I am strong. I am healing. I have the power to overcome this.' Repeat this affirmation as many times as needed, allowing it to reinforce your sense of strength.

Thank you for completing this session. Remember, healing from severe PTSD takes time, and every step you take is a victory. You are not alone in this journey, and with continued support, you can heal and thrive.
`,
        },
    ];

    const handleStart = (session, index) => {
        setTherapyScript(session.script);
        setActiveSessionIndex(index);
        setIsSpeaking(true);
        setIsPaused(false);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveSessionIndex(null);
    };

    const togglePauseResume = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        } else {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices[46];
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            setActiveSessionIndex(null); 
        };
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (therapyScript && isSpeaking) {
            speakText(therapyScript); 
        }
    }, [therapyScript, isSpeaking]);

    return (
        <div className="container">
            <div className="header">
                <div className="left">
                    CalmCare
                </div>
                <Navbar />
            </div>
            <h1>Therapy Sessions</h1>

            <div className="list">
                {therapySessions.map((session, index) => (
                    <div key={index} className="card">
                        <h3>{session.title}</h3>
                        <p>{session.description}</p>
                        <div className="button-group">
                            <button
                                onClick={() => handleStart(session, index)}
                                disabled={isSpeaking || activeSessionIndex === index}
                            >
                                {isSpeaking && activeSessionIndex === index ? "Speaking..." : "Play Audio"}
                            </button>
                            <button
                                onClick={togglePauseResume}
                                disabled={!isSpeaking || activeSessionIndex !== index}
                            >
                                {isPaused ? "Resume" : "Pause"}
                            </button>
                            <button
                                onClick={handleStop}
                                disabled={!isSpeaking || activeSessionIndex !== index}
                            >
                                Stop
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Therapy;