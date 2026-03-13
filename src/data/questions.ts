export type Category = 
  | 'Information & Media Literacy'
  | 'Privacy & Security'
  | 'Digital Footprint & Identity'
  | 'Digital Communication & Etiquette';

export interface Question {
  id: string;
  category: Category;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const questions: Question[] = [
  {
    id: 'q1',
    category: 'Information & Media Literacy',
    text: 'You see a sensational news headline on social media that makes you angry. What is the best first step?',
    options: [
      { id: 'a', text: 'Share it immediately so others know.', isCorrect: false, explanation: 'Sharing without verifying spreads misinformation.' },
      { id: 'b', text: 'Check the comments to see if it is true.', isCorrect: false, explanation: 'Comments are often unreliable and biased.' },
      { id: 'c', text: 'Verify the source and look for the story on reputable news sites.', isCorrect: true, explanation: 'Lateral reading and verifying sources is key to digital literacy.' },
      { id: 'd', text: 'Ignore it completely.', isCorrect: false, explanation: 'While ignoring is better than sharing, verifying helps you stay informed.' }
    ]
  },
  {
    id: 'q2',
    category: 'Privacy & Security',
    text: 'Which of the following is the strongest password strategy?',
    options: [
      { id: 'a', text: 'Using a single complex password for all accounts.', isCorrect: false, explanation: 'If one account is breached, all are compromised.' },
      { id: 'b', text: 'Using your pet\'s name with a number (e.g., Buster123).', isCorrect: false, explanation: 'Personal information is easily guessable.' },
      { id: 'c', text: 'Using a unique passphrase (e.g., BlueHorseStapleBattery) for each account.', isCorrect: true, explanation: 'Passphrases are long, memorable, and hard to crack.' },
      { id: 'd', text: 'Changing your password to a new word every week.', isCorrect: false, explanation: 'Frequent changes often lead to weaker, predictable passwords.' }
    ]
  },
  {
    id: 'q3',
    category: 'Digital Footprint & Identity',
    text: 'Who can potentially see what you post on a "public" social media account?',
    options: [
      { id: 'a', text: 'Only your friends and family.', isCorrect: false, explanation: 'Public means anyone can see it.' },
      { id: 'b', text: 'Anyone on the internet, including future employers or schools.', isCorrect: true, explanation: 'Your digital footprint is permanent and searchable.' },
      { id: 'c', text: 'Only people who follow you.', isCorrect: false, explanation: 'Followers are just a subset of who can see public posts.' },
      { id: 'd', text: 'Nobody, if you delete it after 24 hours.', isCorrect: false, explanation: 'Screenshots and archives mean nothing is truly deleted.' }
    ]
  },
  {
    id: 'q4',
    category: 'Digital Communication & Etiquette',
    text: 'What is the most appropriate way to respond to a cyberbully?',
    options: [
      { id: 'a', text: 'Insult them back to defend yourself.', isCorrect: false, explanation: 'Retaliation often escalates the situation.' },
      { id: 'b', text: 'Block them, save evidence, and report their behavior to a trusted adult or the platform.', isCorrect: true, explanation: 'This protects you and holds the bully accountable.' },
      { id: 'c', text: 'Share their messages publicly to shame them.', isCorrect: false, explanation: 'Public shaming can backfire and cause more harm.' },
      { id: 'd', text: 'Try to reason with them and ask why they are being mean.', isCorrect: false, explanation: 'Bullies often seek a reaction; reasoning rarely works.' }
    ]
  },
  {
    id: 'q5',
    category: 'Information & Media Literacy',
    text: 'What is a "deepfake"?',
    options: [
      { id: 'a', text: 'A very deep philosophical quote found online.', isCorrect: false, explanation: 'This is incorrect.' },
      { id: 'b', text: 'A type of computer virus that steals your data.', isCorrect: false, explanation: 'That is malware or spyware.' },
      { id: 'c', text: 'A manipulated video or audio recording that makes it look like someone said or did something they didn\'t.', isCorrect: true, explanation: 'Deepfakes use AI to create highly realistic fake media.' },
      { id: 'd', text: 'A secure way to browse the internet anonymously.', isCorrect: false, explanation: 'That describes a VPN or Tor.' }
    ]
  },
  {
    id: 'q6',
    category: 'Privacy & Security',
    text: 'You receive an urgent email from your "bank" asking you to click a link and verify your password. What should you do?',
    options: [
      { id: 'a', text: 'Click the link and enter your password quickly.', isCorrect: false, explanation: 'This is how phishing attacks steal credentials.' },
      { id: 'b', text: 'Reply to the email asking if it is real.', isCorrect: false, explanation: 'The attacker will just lie and say yes.' },
      { id: 'c', text: 'Do not click the link; log in to your bank\'s official website directly to check for alerts.', isCorrect: true, explanation: 'Always verify urgent requests through official channels.' },
      { id: 'd', text: 'Forward it to your friends to warn them.', isCorrect: false, explanation: 'Forwarding might accidentally spread the phishing link.' }
    ]
  },
  {
    id: 'q7',
    category: 'Digital Footprint & Identity',
    text: 'Which of the following best describes your "digital footprint"?',
    options: [
      { id: 'a', text: 'The amount of storage space your photos take up on your phone.', isCorrect: false, explanation: 'That is local storage.' },
      { id: 'b', text: 'The trail of data you leave behind while using the internet.', isCorrect: true, explanation: 'This includes posts, searches, location data, and more.' },
      { id: 'c', text: 'A special app that tracks your daily steps.', isCorrect: false, explanation: 'That is a pedometer or fitness tracker.' },
      { id: 'd', text: 'The physical mark your finger leaves on a touchscreen.', isCorrect: false, explanation: 'That is a fingerprint.' }
    ]
  },
  {
    id: 'q8',
    category: 'Digital Communication & Etiquette',
    text: 'When sending a professional email to a teacher or potential employer, what should you always include?',
    options: [
      { id: 'a', text: 'Lots of emojis to show you are friendly.', isCorrect: false, explanation: 'Emojis can seem unprofessional in formal contexts.' },
      { id: 'b', text: 'A clear subject line, a formal greeting, and a sign-off.', isCorrect: true, explanation: 'Professional communication requires structure and respect.' },
      { id: 'c', text: 'Slang and abbreviations (like "ttyl" or "lol") to save time.', isCorrect: false, explanation: 'Slang is inappropriate for professional emails.' },
      { id: 'd', text: 'A demand for an immediate response.', isCorrect: false, explanation: 'This is rude and unprofessional.' }
    ]
  },
  {
    id: 'q9',
    category: 'Information & Media Literacy',
    text: 'You are researching a topic for a project. Which of the following is generally considered the most reliable indicator of a factual source?',
    options: [
      { id: 'a', text: 'The website has a very modern and attractive design.', isCorrect: false, explanation: 'Design does not guarantee accuracy.' },
      { id: 'b', text: 'The article is written by a recognized expert and cites its sources.', isCorrect: true, explanation: 'Expertise and verifiable citations are key indicators of reliability.' },
      { id: 'c', text: 'The article has thousands of likes and shares on social media.', isCorrect: false, explanation: 'Popularity does not equal truth.' },
      { id: 'd', text: 'The website URL ends in .com.', isCorrect: false, explanation: 'Commercial domains (.com) can be owned by anyone.' }
    ]
  },
  {
    id: 'q10',
    category: 'Privacy & Security',
    text: 'What is the primary purpose of Two-Factor Authentication (2FA)?',
    options: [
      { id: 'a', text: 'To make logging into your accounts faster.', isCorrect: false, explanation: '2FA actually adds an extra step, making it slightly slower but much safer.' },
      { id: 'b', text: 'To prevent viruses from infecting your computer.', isCorrect: false, explanation: 'Antivirus software does this, not 2FA.' },
      { id: 'c', text: 'To add an extra layer of security by requiring a second form of verification beyond just a password.', isCorrect: true, explanation: 'Even if a hacker guesses your password, they still need the second factor (like a code sent to your phone).' },
      { id: 'd', text: 'To encrypt your emails so nobody else can read them.', isCorrect: false, explanation: 'That is encryption, not authentication.' }
    ]
  },
  {
    id: 'q11',
    category: 'Digital Footprint & Identity',
    text: 'Which of these actions contributes positively to your digital footprint?',
    options: [
      { id: 'a', text: 'Trolling anonymously on public forums.', isCorrect: false, explanation: 'Trolling is harmful and leaves a negative footprint.' },
      { id: 'b', text: 'Posting a portfolio of your creative work or volunteer activities.', isCorrect: true, explanation: 'Showcasing your skills and positive contributions builds a strong online reputation.' },
      { id: 'c', text: 'Complaining about your teachers or boss online.', isCorrect: false, explanation: 'This can harm your reputation and future opportunities.' },
      { id: 'd', text: 'Sharing a friend\'s secret without their permission.', isCorrect: false, explanation: 'This violates trust and digital etiquette.' }
    ]
  },
  {
    id: 'q12',
    category: 'Digital Communication & Etiquette',
    text: 'What does the term "Netiquette" refer to?',
    options: [
      { id: 'a', text: 'A type of fishing net used in online games.', isCorrect: false, explanation: 'This is a literal interpretation and incorrect.' },
      { id: 'b', text: 'The rules of acceptable, polite, and respectful behavior on the internet.', isCorrect: true, explanation: 'Netiquette is internet etiquette.' },
      { id: 'c', text: 'A software used to block spam emails.', isCorrect: false, explanation: 'That is a spam filter.' },
      { id: 'd', text: 'The speed of your internet connection.', isCorrect: false, explanation: 'That is bandwidth or internet speed.' }
    ]
  }
];
