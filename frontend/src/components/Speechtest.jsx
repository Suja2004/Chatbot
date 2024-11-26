const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.onresult = (event) => console.log(event.results[0][0].transcript);
recognition.start();

export default SpeechRecognition;