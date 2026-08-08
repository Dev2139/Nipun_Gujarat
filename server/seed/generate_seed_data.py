import json
import os

os.makedirs('server/seed/data', exist_ok=True)

# 1. GUJARATI CURRICULUM (44 competencies spanning Balvatika, Grade 1, Grade 2)
gujarati_competencies = [
  # Balvatika (Columns 1-19 in Tracker)
  {
    "code": "G-01",
    "subject": "gujarati",
    "grade": "balvatika",
    "stage": "મૌખિક ભાષા વિકાસ",
    "trackerColumnNumber": 1,
    "sequence": 1,
    "titleGujarati": "ગીતો અને જોડકણાં ગાય છે",
    "titleEnglish": "Sings songs and rhymes",
    "descriptionGujarati": "બાળક સરળ લયબદ્ધ બાળગીતો અને ગુજરાતી જોડકણાં આનંદ સાથે ગાય છે અને તાલ મેળવે છે.",
    "descriptionEnglish": "Student sings rhythmic rhymes and songs with joy.",
    "prerequisiteCompetencyCode": None,
    "learningContent": {
      "headlineGujarati": "આજે આપણે સુંદર બાળગીત ગાઈશું 🎵",
      "instructionGujarati": "ગીત સાંભળો અને સાથે ગાવાનો પ્રયત્ન કરો.",
      "soundPhonicsText": "ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહિ",
      "letterOrSymbol": "🎵",
      "mediaEmojiOrIcon": "🐦",
      "examples": [
        {"wordGujarati": "ચકીબેન", "wordEnglish": "Little Sparrow", "imageEmoji": "🐦", "audioText": "ચકીબેન ચકીબેન"},
        {"wordGujarati": "ઢીંગલી", "wordEnglish": "Doll", "imageEmoji": "🪆", "audioText": "નાની મારી ઢીંગલી"},
        {"wordGujarati": "મોરલો", "wordEnglish": "Peacock", "imageEmoji": "🦚", "audioText": "મોર બની થનગાટ કરે"}
      ],
      "conceptCard": {
        "title": "ગીત અને સંગીત",
        "explanationGujarati": "ગીતો ગાવાથી ભાષા સાંભળવાની અને બોલવાની શક્તિ વધે છે.",
        "visualHint": "સંગીતની ધૂન સાંભળો અને હાથથી તાળી પાડો.",
        "steps": ["ગીત ધ્યાનથી સાંભળો", "શબ્દો સાથે લયબદ્ધ બોલો", "તાળી પાડીને અભિનય કરો"]
      },
      "interactivePractice": [
        {
          "type": "sound_listen",
          "promptGujarati": "આમાંથી કયું પંખી ચીં... ચીં... કરે છે?",
          "audioPrompt": "ચીં ચીં કોણ કરે?",
          "options": ["ચકલી", "કાગડો", "મોર"],
          "correctAnswer": "ચકલી",
          "hintGujarati": "નાની ચકલી ચીં ચીં બોલે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G01-1",
        "questionType": "mcq",
        "promptGujarati": "'ચકીબેન ચકીબેન' ગીતમાં પંખી કયું છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ચકલી", "emoji": "🐦", "isCorrect": True},
          {"id": "opt2", "textGujarati": "સિંહ", "emoji": "🦁", "isCorrect": False},
          {"id": "opt3", "textGujarati": "હાથી", "emoji": "🐘", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ગીતમાં ચકલીબેનની વાત છે."
      },
      {
        "questionId": "Q-G01-2",
        "questionType": "sound_identify",
        "promptGujarati": "મોર કેવો અવાજ કરે છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ટેહૂંક... ટેહૂંક...", "emoji": "🦚", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ભૌં... ભૌં...", "emoji": "🐕", "isCorrect": False},
          {"id": "opt3", "textGujarati": "મ્યાઉં... મ્યાઉં...", "emoji": "🐱", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "મોર ટેહૂંક ટેહૂંક બોલે છે."
      },
      {
        "questionId": "Q-G01-3",
        "questionType": "image_select",
        "promptGujarati": "બાળગીતમાં આવતી 'ઢીંગલી' કઈ છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ઢીંગલી", "emoji": "🪆", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ગાડી", "emoji": "🚗", "isCorrect": False},
          {"id": "opt3", "textGujarati": "દડો", "emoji": "⚽", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ઢીંગલી નાનું રમકડું છે."
      },
      {
        "questionId": "Q-G01-4",
        "questionType": "mcq",
        "promptGujarati": "ગીત ગાતી વખતે આપણે શું કરીએ છીએ?",
        "options": [
          {"id": "opt1", "textGujarati": "તાળી પાડીએ અને ગાઈએ", "emoji": "👏", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ઊંઘી જઈએ", "emoji": "😴", "isCorrect": False},
          {"id": "opt3", "textGujarati": "રડીએ", "emoji": "😢", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ગીત સાથે તાળી પાડવાની મજા આવે છે."
      },
      {
        "questionId": "Q-G01-5",
        "questionType": "true_false",
        "promptGujarati": "જોડકણાં ગાવાથી આનંદ મળે છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "જોડકણાં ગાવાની ખૂબ મજા આવે છે."
      }
    ]
  },
  {
    "code": "G-02",
    "subject": "gujarati",
    "grade": "balvatika",
    "stage": "મૌખિક ભાષા વિકાસ",
    "trackerColumnNumber": 2,
    "sequence": 2,
    "titleGujarati": "શિક્ષક દ્વારા આપેલી સાદી સૂચનાઓ સમજીને અનુસરે છે",
    "titleEnglish": "Understands and follows simple teacher instructions",
    "descriptionGujarati": "શિક્ષકે કહેલી ૧-૨ પગલાંવાળી સૂચનાઓ સમજીને અમલ કરે છે (દા.ત. ઊભા થાઓ, ચોપડી ખોલો).",
    "descriptionEnglish": "Follows 1-2 step classroom instructions.",
    "prerequisiteCompetencyCode": "G-01",
    "learningContent": {
      "headlineGujarati": "સૂચના સાંભળો અને પાલન કરો 👂",
      "instructionGujarati": "શિક્ષક શું કહે છે તે ધ્યાનથી સાંભળો.",
      "soundPhonicsText": "હાથ ઊંચા કરો અને પછી નીચે કરો",
      "letterOrSymbol": "✋",
      "mediaEmojiOrIcon": "🙋",
      "examples": [
        {"wordGujarati": "ઊભા થાઓ", "wordEnglish": "Stand up", "imageEmoji": "🧍", "audioText": "બધા ઊભા થાઓ"},
        {"wordGujarati": "બેસી જાઓ", "wordEnglish": "Sit down", "imageEmoji": "🪑", "audioText": "તમારી જગ્યાએ બેસી જાઓ"},
        {"wordGujarati": "તાળી પાડો", "wordEnglish": "Clap hands", "imageEmoji": "👏", "audioText": "બે વાર તાળી પાડો"}
      ],
      "conceptCard": {
        "title": "સૂચનાનું પાલન",
        "explanationGujarati": "સાંભળીને કામ કરવું એ સારો ગુણ છે.",
        "visualHint": "સૂચના સાંભળો અને તરત કરો.",
        "steps": ["શિક્ષકને ધ્યાનથી સાંભળો", "સમજીને યોગ્ય ક્રિયા કરો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "'હાથ ઊંચા કરો' સૂચના માટે કયું ચિત્ર સાચું છે?",
          "audioPrompt": "હાથ ઊંચા કરો",
          "options": ["🙋 ઊંચા હાથ", "🪑 બેસવું", "😴 ઊંઘવું"],
          "correctAnswer": "🙋 ઊંચા હાથ",
          "hintGujarati": "હાથ આકાશ તરફ ઊંચા કરો."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G02-1",
        "questionType": "mcq",
        "promptGujarati": "શિક્ષક 'બેસી જાઓ' કહે ત્યારે શું કરશો?",
        "options": [
          {"id": "opt1", "textGujarati": "આસન/પાટલી પર શાંતિથી બેસવું", "emoji": "🪑", "isCorrect": True},
          {"id": "opt2", "textGujarati": "દોડવું", "emoji": "🏃", "isCorrect": False},
          {"id": "opt3", "textGujarati": "બહાર જવું", "emoji": "🚪", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "'બેસી જાઓ' એટલે શાંતિથી બેસવું."
      },
      {
        "questionId": "Q-G02-2",
        "questionType": "mcq",
        "promptGujarati": "ચોપડી વાંચવા માટે શિક્ષક કઈ સૂચના આપશે?",
        "options": [
          {"id": "opt1", "textGujarati": "પુસ્તક ખોલો", "emoji": "📖", "isCorrect": True},
          {"id": "opt2", "textGujarati": "બૂટ પહેરો", "emoji": "👟", "isCorrect": False},
          {"id": "opt3", "textGujarati": "લાઈટ બંધ કરો", "emoji": "💡", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "વાંચવા માટે પુસ્તક ખોલવું પડે."
      },
      {
        "questionId": "Q-G02-3",
        "questionType": "image_select",
        "promptGujarati": "'તાળી પાડો' માટે સાચો ઈમોજી કયો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "તાળી પાડવી", "emoji": "👏", "isCorrect": True},
          {"id": "opt2", "textGujarati": "આંખ મીંચવી", "emoji": "🙈", "isCorrect": False},
          {"id": "opt3", "textGujarati": "નાચવું", "emoji": "💃", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "👏 તાળી પાડવાનો સંકેત છે."
      },
      {
        "questionId": "Q-G02-4",
        "questionType": "mcq",
        "promptGujarati": "વર્ગખંડમાં શિક્ષક બોલે ત્યારે આપણે શું કરવું જોઈએ?",
        "options": [
          {"id": "opt1", "textGujarati": "ધ્યાનથી સાંભળવું", "emoji": "👂", "isCorrect": True},
          {"id": "opt2", "textGujarati": "અવાજ કરવો", "emoji": "📢", "isCorrect": False},
          {"id": "opt3", "textGujarati": "રમકડાંથી રમવું", "emoji": "🧸", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ધ્યાનથી સાંભળવાથી બધું સમજાય."
      },
      {
        "questionId": "Q-G02-5",
        "questionType": "true_false",
        "promptGujarati": "'લાઈનમાં ચાલો' એટલે એક પાછળ એક ચાલવું?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "લાઈનમાં ચાલવું એટલે શિસ્ત સાથે ક્રમમાં ચાલવું."
      }
    ]
  },
  {
    "code": "G-03",
    "subject": "gujarati",
    "grade": "balvatika",
    "stage": "ક્રમ ૧: ગ, મ, ન, જ, 'આ'",
    "trackerColumnNumber": 6,
    "sequence": 3,
    "titleGujarati": "મૂળાક્ષર 'ગ' અને 'મ' ની ઓળખ",
    "titleEnglish": "Letter recognition: 'Ga' and 'Ma'",
    "descriptionGujarati": "મૂળાક્ષર 'ગ' (ગણપતિ) અને 'મ' (મરચું) નો ધ્વનિ ઓળખે છે અને શબ્દોમાંથી તારવે છે.",
    "descriptionEnglish": "Identifies Gujarati letters Ga and Ma phonetically.",
    "prerequisiteCompetencyCode": "G-02",
    "learningContent": {
      "headlineGujarati": "આજે આપણે 'ગ' અને 'મ' શીખીશું 🔤",
      "instructionGujarati": "અક્ષર જુઓ, તેનો અવાજ સાંભળો અને યાદ રાખો.",
      "soundPhonicsText": "ગ થી ગણપતિ અને મ થી મરચું",
      "letterOrSymbol": "ગ, મ",
      "mediaEmojiOrIcon": "🐘",
      "examples": [
        {"wordGujarati": "ગણપતિ", "wordEnglish": "Lord Ganesha", "imageEmoji": "🐘", "audioText": "ગ થી ગણપતિ", "breakdown": "ગ + ણ + પ + તિ"},
        {"wordGujarati": "ગાય", "wordEnglish": "Cow", "imageEmoji": "🐄", "audioText": "ગ થી ગાય", "breakdown": "ગ + ા + ય"},
        {"wordGujarati": "મરચું", "wordEnglish": "Chilli", "imageEmoji": "🌶️", "audioText": "મ થી મરચું", "breakdown": "મ + ર + ચું"},
        {"wordGujarati": "મગર", "wordEnglish": "Crocodile", "imageEmoji": "🐊", "audioText": "મ થી મગર", "breakdown": "મ + ગ + ર"}
      ],
      "conceptCard": {
        "title": "મૂળાક્ષર 'ગ' અને 'મ'",
        "explanationGujarati": "'ગ' લખતી વખતે અર્ધગોળ કરી ઊભી લીટી કરવી. 'મ' માં નાનું ગોળ કરી આડી અને ઊભી લીટી કરવી.",
        "visualHint": "ગ -> ગાય 🐄, મ -> મરચું 🌶️",
        "steps": ["અક્ષરનો આકાર ઓળખો", "ધ્વનિ મોટેથી બોલો", "શબ્દમાં પહેલો અક્ષર શોધો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "'ગ' થી શરૂ થતો શબ્દ કયો છે?",
          "audioPrompt": "ગ થી કયો શબ્દ બને?",
          "options": ["ગાય", "કમળ", "ઘર"],
          "correctAnswer": "ગાય",
          "hintGujarati": "ગાય દૂધ આપે છે."
        },
        {
          "type": "sound_listen",
          "promptGujarati": "'મરચું' શબ્દનો પહેલો અક્ષર કયો છે?",
          "audioPrompt": "મરચું નો પહેલો અક્ષર કયો?",
          "options": ["મ", "ગ", "ન"],
          "correctAnswer": "મ",
          "hintGujarati": "મ થી મરચું તીખું લાગે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G03-1",
        "questionType": "mcq",
        "promptGujarati": "કયો અક્ષર 'ગ' છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ગ", "emoji": "🐘", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ન", "emoji": "💧", "isCorrect": False},
          {"id": "opt3", "textGujarati": "જ", "emoji": "🌱", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "'ગ' થી ગણપતિ થાય છે."
      },
      {
        "questionId": "Q-G03-2",
        "questionType": "image_select",
        "promptGujarati": "'મ' અક્ષરથી શરૂ થતું ચિત્ર શોધો:",
        "options": [
          {"id": "opt1", "textGujarati": "મરચું", "emoji": "🌶️", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ઝાડ", "emoji": "🌳", "isCorrect": False},
          {"id": "opt3", "textGujarati": "પતંગ", "emoji": "🪁", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "મરચું 'મ' થી શરૂ થાય છે."
      },
      {
        "questionId": "Q-G03-3",
        "questionType": "mcq",
        "promptGujarati": "'મગર' શબ્દમાં કેટલા અક્ષર છે?",
        "options": [
          {"id": "opt1", "textGujarati": "૩ (ત્રણ) - મ, ગ, ર", "emoji": "🐊", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૧ (એક)", "emoji": "1️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૫ (પાંચ)", "emoji": "5️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "મ + ગ + ર = મગર (૩ અક્ષર)."
      },
      {
        "questionId": "Q-G03-4",
        "questionType": "mcq",
        "promptGujarati": "'ગ' અને 'મ' ભેગા થઈને કયો શબ્દ બને?",
        "options": [
          {"id": "opt1", "textGujarati": "ગમ", "emoji": "✨", "isCorrect": True},
          {"id": "opt2", "textGujarati": "રસ", "emoji": "🥤", "isCorrect": False},
          {"id": "opt3", "textGujarati": "દસ", "emoji": "🔟", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ગ + મ = ગમ."
      },
      {
        "questionId": "Q-G03-5",
        "questionType": "true_false",
        "promptGujarati": "'ગાય' શબ્દનો પહેલો અક્ષર 'ગ' છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "હા, ગાય 'ગ' થી શરૂ થાય છે."
      }
    ]
  },
  {
    "code": "G-04",
    "subject": "gujarati",
    "grade": "balvatika",
    "stage": "ક્રમ ૧: ગ, મ, ન, જ, 'આ'",
    "trackerColumnNumber": 7,
    "sequence": 4,
    "titleGujarati": "મૂળાક્ષર 'ન' અને 'જ' ની ઓળખ",
    "titleEnglish": "Letter recognition: 'Na' and 'Ja'",
    "descriptionGujarati": "મૂળાક્ષર 'ન' (નળ) અને 'જ' (જલેબી/જમરૂખ) નો ધ્વનિ ઓળખે છે અને શબ્દો વાંચે છે.",
    "descriptionEnglish": "Identifies Gujarati letters Na and Ja phonetically.",
    "prerequisiteCompetencyCode": "G-03",
    "learningContent": {
      "headlineGujarati": "આજે આપણે 'ન' અને 'જ' શીખીશું 🚰",
      "instructionGujarati": "અક્ષર જુઓ અને તેના શબ્દો બોલો.",
      "soundPhonicsText": "ન થી નળ અને જ થી જલેબી",
      "letterOrSymbol": "ન, જ",
      "mediaEmojiOrIcon": "🚰",
      "examples": [
        {"wordGujarati": "નળ", "wordEnglish": "Tap", "imageEmoji": "🚰", "audioText": "ન થી નળ", "breakdown": "ન + ળ"},
        {"wordGujarati": "નખ", "wordEnglish": "Nail", "imageEmoji": "💅", "audioText": "ન થી નખ", "breakdown": "ન + ખ"},
        {"wordGujarati": "જલેબી", "wordEnglish": "Jalebi", "imageEmoji": "🥨", "audioText": "જ થી જલેબી", "breakdown": "જ + લે + બી"},
        {"wordGujarati": "જગ", "wordEnglish": "Jug", "imageEmoji": "🫖", "audioText": "જ થી જગ", "breakdown": "જ + ગ"}
      ],
      "conceptCard": {
        "title": "મૂળાક્ષર 'ન' અને 'જ'",
        "explanationGujarati": "'ન' થી નળ, નખ, નમન બને છે. 'જ' થી જગ, જલેબી, જમ બને છે.",
        "visualHint": "ન -> નળ 🚰, જ -> જગ 🫖",
        "steps": ["અક્ષર ઓળખો", "ધ્વનિ ઉચ્ચારો", "શબ્દ વાંચો: જગ, નમ, મગ, જમ"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "'જગ' શબ્દ ક્યાં લખેલો છે?",
          "audioPrompt": "જગ શબ્દ શોધો",
          "options": ["જગ", "મગ", "નમ"],
          "correctAnswer": "જગ",
          "hintGujarati": "જ અને ગ ભેગા મળીને જગ બને."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G04-1",
        "questionType": "mcq",
        "promptGujarati": "કયો અક્ષર 'ન' છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ન", "emoji": "🚰", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ગ", "emoji": "🐘", "isCorrect": False},
          {"id": "opt3", "textGujarati": "ર", "emoji": "🚗", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "'ન' થી નળ થાય છે."
      },
      {
        "questionId": "Q-G04-2",
        "questionType": "image_select",
        "promptGujarati": "'જ' અક્ષરથી શરૂ થતી વાનગી કઈ છે?",
        "options": [
          {"id": "opt1", "textGujarati": "જલેબી", "emoji": "🥨", "isCorrect": True},
          {"id": "opt2", "textGujarati": "સફરજન", "emoji": "🍎", "isCorrect": False},
          {"id": "opt3", "textGujarati": "કેળું", "emoji": "🍌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "જલેબી 'જ' થી શરૂ થાય છે."
      },
      {
        "questionId": "Q-G04-3",
        "questionType": "mcq",
        "promptGujarati": "'ન' અને 'મ' જોડવાથી કયો શબ્દ બને?",
        "options": [
          {"id": "opt1", "textGujarati": "નમ", "emoji": "🙏", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ગજ", "emoji": "📏", "isCorrect": False},
          {"id": "opt3", "textGujarati": "જગ", "emoji": "🫖", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ન + મ = નમ."
      },
      {
        "questionId": "Q-G04-4",
        "questionType": "mcq",
        "promptGujarati": "'જમ' શબ્દમાં છેલ્લો અક્ષર કયો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "મ", "emoji": "🍽️", "isCorrect": True},
          {"id": "opt2", "textGujarati": "જ", "emoji": "🫖", "isCorrect": False},
          {"id": "opt3", "textGujarati": "ન", "emoji": "🚰", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "જમ શબ્દમાં છેલ્લે 'મ' આવે છે."
      },
      {
        "questionId": "Q-G04-5",
        "questionType": "true_false",
        "promptGujarati": "'ગ', 'મ', 'ન', 'જ' થી 'મગન' શબ્દ બને?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "મ + ગ + ન = મગન બને છે."
      }
    ]
  },
  {
    "code": "G-05",
    "subject": "gujarati",
    "grade": "grade_1",
    "stage": "ક્રમ ૨: વ, ર, સ, દ, 'એ'",
    "trackerColumnNumber": 11,
    "sequence": 5,
    "titleGujarati": "મૂળાક્ષર 'વ', 'ર', 'સ', 'દ' અને કાના 'ા' ની ઓળખ",
    "titleEnglish": "Letters: Va, Ra, Sa, Da and Kana (Matra aa)",
    "descriptionGujarati": "મૂળાક્ષરો વ, ર, સ, દ અને કાના વાળા શબ્દો (દા.ત. રામ, ગામ, દાદા, વાન) વાંચે છે અને લખે છે.",
    "descriptionEnglish": "Reads and writes words with Va, Ra, Sa, Da and kana matra.",
    "prerequisiteCompetencyCode": "G-04",
    "learningContent": {
      "headlineGujarati": "આજે આપણે 'વ', 'ર', 'સ', 'દ' અને કાનો 'ા' શીખીશું 🚗",
      "instructionGujarati": "અક્ષર સાથે કાનો 'ા' લગાડતા મોટો અવાજ થાય છે: ગ + ા = ગા, ર + ા = રા.",
      "soundPhonicsText": "વ થી વહાણ, ર થી રથ, સ થી સસલું, દ થી દડો",
      "letterOrSymbol": "વ, ર, સ, દ, ા",
      "mediaEmojiOrIcon": "🐰",
      "examples": [
        {"wordGujarati": "સસલું", "wordEnglish": "Rabbit", "imageEmoji": "🐰", "audioText": "સ થી સસલું", "breakdown": "સ + સ + લું"},
        {"wordGujarati": "દડો", "wordEnglish": "Ball", "imageEmoji": "⚽", "audioText": "દ થી દડો", "breakdown": "દ + ડો"},
        {"wordGujarati": "રામ", "wordEnglish": "Ram", "imageEmoji": "🏹", "audioText": "ર ને કાનો રા - રામ", "breakdown": "ર + ા + મ"},
        {"wordGujarati": "ગામ", "wordEnglish": "Village", "imageEmoji": "🏡", "audioText": "ગ ને કાનો ગા - ગામ", "breakdown": "ગ + ા + મ"}
      ],
      "conceptCard": {
        "title": "કાનો 'ા' ની સમજ",
        "explanationGujarati": "કોઈપણ અક્ષરની બાજુમાં ઊભી લીટી (ા) આવે ત્યારે 'આ' જેવો ઉચ્ચાર થાય છે. જેમ કે: ર -> રા, વ -> વા, દ -> દા.",
        "visualHint": "દ + ા + દ + ા = દાદા 👴",
        "steps": ["અક્ષર ઓળખો", "કાનો લગાડીને ઉચ્ચારો", "શબ્દ વાંચો: રામ, ગામ, વાન, દાદા"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "'ગામ' શબ્દ કયો છે?",
          "audioPrompt": "ગામ શબ્દ શોધો",
          "options": ["ગામ", "ગમ", "મગ"],
          "correctAnswer": "ગામ",
          "hintGujarati": "ગ ને કાનો ગા અને મ -> ગામ."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G05-1",
        "questionType": "mcq",
        "promptGujarati": "'સસલું' શબ્દ કયા અક્ષરથી શરૂ થાય છે?",
        "options": [
          {"id": "opt1", "textGujarati": "સ", "emoji": "🐰", "isCorrect": True},
          {"id": "opt2", "textGujarati": "દ", "emoji": "⚽", "isCorrect": False},
          {"id": "opt3", "textGujarati": "વ", "emoji": "⛵", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "સસલું 'સ' થી શરૂ થાય છે."
      },
      {
        "questionId": "Q-G05-2",
        "questionType": "mcq",
        "promptGujarati": "'ર' ને કાનો લગાડતા શું વંચાય?",
        "options": [
          {"id": "opt1", "textGujarati": "રા", "emoji": "📢", "isCorrect": True},
          {"id": "opt2", "textGujarati": "રી", "emoji": "🔹", "isCorrect": False},
          {"id": "opt3", "textGujarati": "રે", "emoji": "🔸", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ર + ા = રા."
      },
      {
        "questionId": "Q-G05-3",
        "questionType": "image_select",
        "promptGujarati": "'દાદા' માટે કયું ચિત્ર યોગ્ય છે?",
        "options": [
          {"id": "opt1", "textGujarati": "દાદા", "emoji": "👴", "isCorrect": True},
          {"id": "opt2", "textGujarati": "બાળક", "emoji": "👶", "isCorrect": False},
          {"id": "opt3", "textGujarati": "ઢીંગલી", "emoji": "🪆", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "દાદા 👴 વડીલ છે."
      },
      {
        "questionId": "Q-G05-4",
        "questionType": "mcq",
        "promptGujarati": "'રામ ગામ જાય છે' - આ વાક્યમાં કેટલા શબ્દો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "૪ (ચાર)", "emoji": "4️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૨ (બે)", "emoji": "2️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "રામ (૧) ગામ (૨) જાય (૩) છે (૪)."
      },
      {
        "questionId": "Q-G05-5",
        "questionType": "true_false",
        "promptGujarati": "'દ' થી 'દડો' બને છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "દ થી દડો રમવાનો દડો."
      }
    ]
  },
  {
    "code": "G-06",
    "subject": "gujarati",
    "grade": "grade_1",
    "stage": "ક્રમ ૩: ક, બ, અ, છ, એ, ઐ",
    "trackerColumnNumber": 16,
    "sequence": 6,
    "titleGujarati": "મૂળાક્ષર 'ક', 'બ', 'અ', 'છ' અને એકમાત્ર 'ે' ની ઓળખ",
    "titleEnglish": "Letters: Ka, Ba, A, Chha and Ekmatra (e)",
    "descriptionGujarati": "ક, બ, અ, છ અક્ષરો અને એકમાત્ર વાળા શબ્દો (દા.ત. કમળ, બતક, કેરી, બેર, છેલ્લે) વાંચે છે.",
    "descriptionEnglish": "Reads words with Ka, Ba, A, Chha and ekmatra vowel sign.",
    "prerequisiteCompetencyCode": "G-05",
    "learningContent": {
      "headlineGujarati": "આજે આપણે 'ક', 'બ', 'અ', 'છ' અને એકમાત્ર 'ે' શીખીશું 🪷",
      "instructionGujarati": "અક્ષર ઉપર એકમાત્ર 'ે' આવે એટલે 'એ' જેવો અવાજ નીકળે: ક + ે = કે, બ + ે = બે.",
      "soundPhonicsText": "ક થી કમળ, બ થી બતક, અ થી અનાર, છ થી છત્રી",
      "letterOrSymbol": "ક, બ, અ, છ, ે",
      "mediaEmojiOrIcon": "🪷",
      "examples": [
        {"wordGujarati": "કમળ", "wordEnglish": "Lotus", "imageEmoji": "🪷", "audioText": "ક થી કમળ", "breakdown": "ક + મ + ળ"},
        {"wordGujarati": "બતક", "wordEnglish": "Duck", "imageEmoji": "🦆", "audioText": "બ થી બતક", "breakdown": "બ + ત + ક"},
        {"wordGujarati": "છત્રી", "wordEnglish": "Umbrella", "imageEmoji": "☂️", "audioText": "છ થી છત્રી", "breakdown": "છ + ત્ + રી"},
        {"wordGujarati": "કેરી", "wordEnglish": "Mango", "imageEmoji": "🥭", "audioText": "ક ને એકમાત્ર કે - કેરી", "breakdown": "ક + ે + ર + ી"}
      ],
      "conceptCard": {
        "title": "એકમાત્ર 'ે' ની સમજ",
        "explanationGujarati": "અક્ષરની ઉપર એક લીટી (ે) લાગે ત્યારે અવાજ બદલાય: ર -> રે, દ -> દે, ક -> કે.",
        "visualHint": "ક + ે + ર + ી = કેરી 🥭",
        "steps": ["અક્ષર ઓળખો", "એકમાત્ર લગાડીને બોલો", "શબ્દ વાંચો: કેરમ, બેગ, શેર, છેલ"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "'કેરી' શબ્દ કયો છે?",
          "audioPrompt": "કેરી શબ્દ શોધો",
          "options": ["કેરી", "કમળ", "કાબર"],
          "correctAnswer": "કેરી",
          "hintGujarati": "મીઠી મીઠી પાકી કેરી."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G06-1",
        "questionType": "mcq",
        "promptGujarati": "કયો અક્ષર 'ક' છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ક", "emoji": "🪷", "isCorrect": True},
          {"id": "opt2", "textGujarati": "બ", "emoji": "🦆", "isCorrect": False},
          {"id": "opt3", "textGujarati": "છ", "emoji": "☂️", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "'ક' થી કમળ થાય છે."
      },
      {
        "questionId": "Q-G06-2",
        "questionType": "image_select",
        "promptGujarati": "વરસાદમાં આપણે શું ઓઢીએ છીએ?",
        "options": [
          {"id": "opt1", "textGujarati": "છત્રી", "emoji": "☂️", "isCorrect": True},
          {"id": "opt2", "textGujarati": "પંખો", "emoji": "🪭", "isCorrect": False},
          {"id": "opt3", "textGujarati": "દડો", "emoji": "⚽", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "છત્રી 'છ' થી શરૂ થાય છે."
      },
      {
        "questionId": "Q-G06-3",
        "questionType": "mcq",
        "promptGujarati": "'બ' ને એકમાત્ર લગાડતાં શું બને?",
        "options": [
          {"id": "opt1", "textGujarati": "બે", "emoji": "2️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "બા", "emoji": "👵", "isCorrect": False},
          {"id": "opt3", "textGujarati": "બો", "emoji": "📦", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "બ + ે = બે."
      },
      {
        "questionId": "Q-G06-4",
        "questionType": "mcq",
        "promptGujarati": "'બતક તરે છે' - આ વાક્યમાં કોણ તરે છે?",
        "options": [
          {"id": "opt1", "textGujarati": "બતક", "emoji": "🦆", "isCorrect": True},
          {"id": "opt2", "textGujarati": "બિલાડી", "emoji": "🐱", "isCorrect": False},
          {"id": "opt3", "textGujarati": "વાંદરો", "emoji": "🐒", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "પાણીમાં બતક તરે છે."
      },
      {
        "questionId": "Q-G06-5",
        "questionType": "true_false",
        "promptGujarati": "'કમળ' આપણું રાષ્ટ્રીય ફૂલ છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "કમળ ભારતનું રાષ્ટ્રીય ફૂલ છે."
      }
    ]
  },
  {
    "code": "G-07",
    "subject": "gujarati",
    "grade": "grade_2",
    "stage": "જોડાક્ષરો અને ફકરા વાચન",
    "trackerColumnNumber": 35,
    "sequence": 7,
    "titleGujarati": "સરખી મૂળાક્ષરોથી બનતા જોડાક્ષરોવાળા શબ્દોનું વાચન",
    "titleEnglish": "Double consonant conjuncts (Tta, Ppa, Mma, Nna, Lla)",
    "descriptionGujarati": "સરખી મૂળાક્ષર જોડાઈને બનતા જોડાક્ષર (દા.ત. પપ્પા, મમ્મી, ચમ્મચ, ફુગ્ગો, સજ્જન) ઓળખે છે અને સાચો ઉચ્ચાર કરે છે.",
    "descriptionEnglish": "Reads and writes conjunct words formed with identical consonants.",
    "prerequisiteCompetencyCode": "G-06",
    "learningContent": {
      "headlineGujarati": "આજે આપણે જોડાક્ષરો શીખીશું 🤝",
      "instructionGujarati": "જ્યારે બે સમાન અક્ષર ભેગા જોડાય ત્યારે જોડાક્ષર બને છે: પ્ + પા = પ્પા.",
      "soundPhonicsText": "પપ્પા, મમ્મી, ચપ્પલ, ફુગ્ગો, બિલ્લી",
      "letterOrSymbol": "ત્ત, પ્પ, મ્મ, લ્લ, ગ્ગ",
      "mediaEmojiOrIcon": "👨‍👩‍👧",
      "examples": [
        {"wordGujarati": "પપ્પા", "wordEnglish": "Father", "imageEmoji": "👨", "audioText": "પપ્પા", "breakdown": "પ + પ્ + પા"},
        {"wordGujarati": "મમ્મી", "wordEnglish": "Mother", "imageEmoji": "👩", "audioText": "મમ્મી", "breakdown": "મ + મ્ + મી"},
        {"wordGujarati": "ફુગ્ગો", "wordEnglish": "Balloon", "imageEmoji": "🎈", "audioText": "ફુગ્ગો", "breakdown": "ફુ + ગ્ + ગો"},
        {"wordGujarati": "બિલ્લી", "wordEnglish": "Cat", "imageEmoji": "🐱", "audioText": "બિલ્લી", "breakdown": "બિ + લ્ + લી"}
      ],
      "conceptCard": {
        "title": "જોડાક્ષરનો નિયમ",
        "explanationGujarati": "પહેલો અક્ષર અડધો બોલાય અને બીજો અક્ષર પૂરો બોલાય. ભારપૂર્વક ઉચ્ચારણ થાય છે.",
        "visualHint": "ફુ + ગ્ + ગો = ફુગ્ગો 🎈",
        "steps": ["જોડાક્ષર ઓળખો", "ભાર આપીને સ્પષ્ટ ઉચ્ચાર કરો", "વાક્યમાં વાંચો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "'ફુગ્ગો' શબ્દ કયો છે?",
          "audioPrompt": "ફુગ્ગો શબ્દ પસંદ કરો",
          "options": ["ફુગ્ગો", "ફૂગો", "ફુગ"],
          "correctAnswer": "ફુગ્ગો",
          "hintGujarati": "રંગબેરંગી હવા ભરેલો ફુગ્ગો."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G07-1",
        "questionType": "mcq",
        "promptGujarati": "'પપ્પા' શબ્દમાં કયો જોડાક્ષર છે?",
        "options": [
          {"id": "opt1", "textGujarati": "પ્પ (બે 'પ')", "emoji": "👨", "isCorrect": True},
          {"id": "opt2", "textGujarati": "મ્મ", "emoji": "👩", "isCorrect": False},
          {"id": "opt3", "textGujarati": "ત્ત", "emoji": "🔹", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "પપ્પામાં અડધો પ અને પૂરો પા જોડાયેલા છે."
      },
      {
        "questionId": "Q-G07-2",
        "questionType": "image_select",
        "promptGujarati": "'ફુગ્ગો' દર્શાવતું ચિત્ર કયું છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ફુગ્ગો", "emoji": "🎈", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ચોકલેટ", "emoji": "🍫", "isCorrect": False},
          {"id": "opt3", "textGujarati": "સાયકલ", "emoji": "🚲", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "🎈 ફુગ્ગો છે."
      },
      {
        "questionId": "Q-G07-3",
        "questionType": "mcq",
        "promptGujarati": "કયો શબ્દ જોડાક્ષરવાળો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ચમ્મચ", "emoji": "🥄", "isCorrect": True},
          {"id": "opt2", "textGujarati": "રમકડું", "emoji": "🧸", "isCorrect": False},
          {"id": "opt3", "textGujarati": "કમળ", "emoji": "🪷", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ચમ્મચ માં 'મ્મ' જોડાક્ષર છે."
      },
      {
        "questionId": "Q-G07-4",
        "questionType": "mcq",
        "promptGujarati": "'બિલ્લી દૂધ પીવે છે' - આમાં જોડાક્ષર શબ્દ કયો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "બિલ્લી", "emoji": "🐱", "isCorrect": True},
          {"id": "opt2", "textGujarati": "દૂધ", "emoji": "🥛", "isCorrect": False},
          {"id": "opt3", "textGujarati": "પીવે", "emoji": "🥤", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "બિલ્લીમાં 'લ્લી' જોડાક્ષર છે."
      },
      {
        "questionId": "Q-G07-5",
        "questionType": "true_false",
        "promptGujarati": "'મમ્મી' શબ્દ સાચી રીતે જોડાક્ષરથી લખાયો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "મ + મ્ + મી = મમ્મી સાચું લખાણ છે."
      }
    ]
  },
  {
    "code": "G-08",
    "subject": "gujarati",
    "grade": "grade_2",
    "stage": "વાચન અર્થગ્રહણ અને પ્રવાહિતા",
    "trackerColumnNumber": 44,
    "sequence": 8,
    "titleGujarati": "ફકરાનું વાચન અને અર્થગ્રહણ",
    "titleEnglish": "Paragraph Reading and Comprehension (Grade 2 FLN Goal)",
    "descriptionGujarati": "૬ થી ૮ વાક્યોનો પરિચિત ફકરો પ્રવાહિતા સાથે વાંચીને તેના પ્રશ્નોના ઉત્તર આપે છે.",
    "descriptionEnglish": "Reads 6-8 sentence paragraph fluently and answers comprehension questions.",
    "prerequisiteCompetencyCode": "G-07",
    "learningContent": {
      "headlineGujarati": "આજે આપણે સુંદર વાર્તા વાંચીશું 📖",
      "instructionGujarati": "ફકરો ધ્યાનથી વાંચો અને તેના પ્રશ્નોના સાચા જવાબ આપો.",
      "soundPhonicsText": "એક નાનો બગીચો હતો. તેમાં રંગબેરંગી ફૂલો ખીલ્યા હતા. પતંગિયાં ફૂલો પર ઊડતાં હતાં. મીરા રોજ બગીચામાં રમવા જતી હતી.",
      "letterOrSymbol": "📖",
      "mediaEmojiOrIcon": "🌸",
      "examples": [
        {"wordGujarati": "બગીચો", "wordEnglish": "Garden", "imageEmoji": "🏡", "audioText": "સુંદર બગીચો"},
        {"wordGujarati": "પતંગિયું", "wordEnglish": "Butterfly", "imageEmoji": "🦋", "audioText": "રંગબેરંગી પતંગિયું"},
        {"wordGujarati": "ફૂલ", "wordEnglish": "Flower", "imageEmoji": "🌸", "audioText": "સુગંધી ફૂલ"}
      ],
      "conceptCard": {
        "title": "વાચન અર્થગ્રહણ",
        "explanationGujarati": "વાંચતી વખતે અર્થ સમજવો સૌથી મહત્વનો છે. વાર્તામાં કોણ છે અને શું થાય છે તે યાદ રાખો.",
        "visualHint": "મીરા બગીચામાં પતંગિયા સાથે રમે છે 🦋",
        "steps": ["દરેક વાક્ય શાંતિથી વાંચો", "મુખ્ય બાબતો સમજો", "પ્રશ્નોના ઉત્તર આપો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "બગીચામાં ફૂલો પર કોણ ઊડતું હતું?",
          "audioPrompt": "ફૂલો પર કોણ ઊડે છે?",
          "options": ["પતંગિયાં", "વાંદરા", "હાથી"],
          "correctAnswer": "પતંગિયાં",
          "hintGujarati": "પતંગિયાં પાંખો ફફડાવીને ફૂલ પર બેસે છે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-G08-1",
        "questionType": "mcq",
        "promptGujarati": "બગીચામાં રોજ રમવા કોણ જતી હતી?",
        "options": [
          {"id": "opt1", "textGujarati": "મીરા", "emoji": "👧", "isCorrect": True},
          {"id": "opt2", "textGujarati": "રાજુ", "emoji": "👦", "isCorrect": False},
          {"id": "opt3", "textGujarati": "રોહન", "emoji": "🧒", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "વાર્તામાં મીરા બગીચામાં રમવા જાય છે."
      },
      {
        "questionId": "Q-G08-2",
        "questionType": "mcq",
        "promptGujarati": "બગીચામાં શું ખીલ્યું હતું?",
        "options": [
          {"id": "opt1", "textGujarati": "રંગબેરંગી ફૂલો", "emoji": "🌸", "isCorrect": True},
          {"id": "opt2", "textGujarati": "કાંટા", "emoji": "🌵", "isCorrect": False},
          {"id": "opt3", "textGujarati": "પથ્થરો", "emoji": "🪨", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "બગીચામાં સુંદર રંગબેરંગી ફૂલો ખીલ્યા હતા."
      },
      {
        "questionId": "Q-G08-3",
        "questionType": "image_select",
        "promptGujarati": "ફૂલ પર બેસતું જીવજંતુ કયું છે?",
        "options": [
          {"id": "opt1", "textGujarati": "પતંગિયું", "emoji": "🦋", "isCorrect": True},
          {"id": "opt2", "textGujarati": "માછલી", "emoji": "🐟", "isCorrect": False},
          {"id": "opt3", "textGujarati": "કાચબો", "emoji": "🐢", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "પતંગિયું ફૂલોનો રસ ચૂસે છે."
      },
      {
        "questionId": "Q-G08-4",
        "questionType": "mcq",
        "promptGujarati": "'બગીચો' શબ્દનો સમાનાર્થી શબ્દ કયો છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ઉદ્યાન / વાડી", "emoji": "🌳", "isCorrect": True},
          {"id": "opt2", "textGujarati": "દરિયો", "emoji": "🌊", "isCorrect": False},
          {"id": "opt3", "textGujarati": "પહાડ", "emoji": "⛰️", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "બગીચાને ઉદ્યાન પણ કહેવાય છે."
      },
      {
        "questionId": "Q-G08-5",
        "questionType": "true_false",
        "promptGujarati": "મીરાને બગીચામાં રમવાની મજા આવતી હતી?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "બગીચામાં રમવાથી બાળક ખુશ થાય છે."
      }
    ]
  }
]

# 2. MATHEMATICS CURRICULUM (30 competencies spanning Balvatika, Grade 1, Grade 2)
math_competencies = [
  {
    "code": "M-01",
    "subject": "mathematics",
    "grade": "balvatika",
    "stage": "પગલું ૧: તુલના / સરખામણી",
    "trackerColumnNumber": 1,
    "sequence": 1,
    "titleGujarati": "સૌથી નાની અને સૌથી મોટી વસ્તુઓની સરખામણી",
    "titleEnglish": "Comparison of biggest and smallest objects",
    "descriptionGujarati": "ચિત્રો કે મૂર્ત વસ્તુઓ જોઈ સૌથી મોટી અને સૌથી નાની વસ્તુ ઓળખી બતાવે છે.",
    "descriptionEnglish": "Identifies biggest and smallest objects visually.",
    "prerequisiteCompetencyCode": None,
    "learningContent": {
      "headlineGujarati": "આજે આપણે નાનું અને મોટું શીખીશું 🐘 🐭",
      "instructionGujarati": "વસ્તુઓ જુઓ અને સરખામણી કરો: કઈ વસ્તુ મોટી છે અને કઈ નાની છે?",
      "soundPhonicsText": "હાથી મોટો છે અને ઉંદર નાનો છે",
      "letterOrSymbol": "📏",
      "mediaEmojiOrIcon": "🐘",
      "examples": [
        {"wordGujarati": "મોટો હાથી", "wordEnglish": "Big Elephant", "imageEmoji": "🐘", "audioText": "હાથી ઘણો મોટો છે"},
        {"wordGujarati": "નાનો ઉંદર", "wordEnglish": "Small Mouse", "imageEmoji": "🐭", "audioText": "ઉંદર નાનો છે"},
        {"wordGujarati": "મોટું ઝાડ", "wordEnglish": "Big Tree", "imageEmoji": "🌳", "audioText": "ઝાડ મોટું છે"},
        {"wordGujarati": "નાનો છોડ", "wordEnglish": "Small Plant", "imageEmoji": "🌱", "audioText": "છોડ નાનો છે"}
      ],
      "conceptCard": {
        "title": "કદની સરખામણી",
        "explanationGujarati": "વસ્તુઓના કદ જોઈને આપણે મોટું કે નાનું નક્કી કરી શકીએ છીએ.",
        "visualHint": "હાથી 🐘 > ઉંદર 🐭",
        "steps": ["બંને વસ્તુઓ ધ્યાનથી જુઓ", "કઈ વસ્તુ વધુ જગ્યા રોકે છે તે નક્કી કરો", "મોટી કે નાની વસ્તુ પસંદ કરો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "આમાંથી સૌથી મોટું પ્રાણી કયું છે?",
          "audioPrompt": "સૌથી મોટું પ્રાણી શોધો",
          "options": ["હાથી", "બિલાડી", "કીડી"],
          "correctAnswer": "હાથી",
          "hintGujarati": "હાથી કદમાં સૌથી વિશાળ હોય છે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M01-1",
        "questionType": "image_select",
        "promptGujarati": "કઈ વસ્તુ સૌથી મોટી છે?",
        "options": [
          {"id": "opt1", "textGujarati": "તરબૂચ", "emoji": "🍉", "isCorrect": True},
          {"id": "opt2", "textGujarati": "લીંબુ", "emoji": "🍋", "isCorrect": False},
          {"id": "opt3", "textGujarati": "બોર/દ્રાક્ષ", "emoji": "🍇", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "તરબૂચ કદમાં સૌથી મોટું હોય છે."
      },
      {
        "questionId": "Q-M01-2",
        "questionType": "mcq",
        "promptGujarati": "ઉંદર અને હાથીમાં સૌથી નાનું કોણ છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ઉંદર", "emoji": "🐭", "isCorrect": True},
          {"id": "opt2", "textGujarati": "હાથી", "emoji": "🐘", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ઉંદર હાથી કરતાં ઘણો નાનો છે."
      },
      {
        "questionId": "Q-M01-3",
        "questionType": "mcq",
        "promptGujarati": "મોટા વાહન પર સાચું કરો:",
        "options": [
          {"id": "opt1", "textGujarati": "બસ", "emoji": "🚌", "isCorrect": True},
          {"id": "opt2", "textGujarati": "સાયકલ", "emoji": "🚲", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "બસ સાયકલ કરતાં ઘણી મોટી હોય છે."
      },
      {
        "questionId": "Q-M01-4",
        "questionType": "image_select",
        "promptGujarati": "સૌથી નાનું પક્ષી કયું છે?",
        "options": [
          {"id": "opt1", "textGujarati": "ચકલી", "emoji": "🐦", "isCorrect": True},
          {"id": "opt2", "textGujarati": "શાહમૃગ", "emoji": "🦤", "isCorrect": False},
          {"id": "opt3", "textGujarati": "મોર", "emoji": "🦚", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ચકલી કદમાં નાની હોય છે."
      },
      {
        "questionId": "Q-M01-5",
        "questionType": "true_false",
        "promptGujarati": "ફૂટબોલનો દડો લખોટી કરતાં મોટો હોય છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "હા, ફૂટબોલ કદમાં ઘણો મોટો હોય છે."
      }
    ]
  },
  {
    "code": "M-02",
    "subject": "mathematics",
    "grade": "balvatika",
    "stage": "પગલું ૨: ૧ થી ૫ સંખ્યાજ્ઞાન",
    "trackerColumnNumber": 2,
    "sequence": 2,
    "titleGujarati": "૧ થી ૫ સુધીનું સંખ્યાજ્ઞાન અને ગણતરી",
    "titleEnglish": "Number sense and counting: 1 to 5",
    "descriptionGujarati": "૧ થી ૫ સુધીની સંખ્યાઓ ઓળખે છે, બોલે છે અને વસ્તુઓ ગણીને સાચી સંખ્યા બતાવે છે.",
    "descriptionEnglish": "Recognizes, speaks, and counts objects from 1 to 5.",
    "prerequisiteCompetencyCode": "M-01",
    "learningContent": {
      "headlineGujarati": "આજે આપણે ૧ થી ૫ ગણતાં શીખીશું 🔢",
      "instructionGujarati": "આંગળીઓ ગણો અને સંખ્યા બોલો: એક, બે, ત્રણ, ચાર, પાંચ.",
      "soundPhonicsText": "૧ એકડે એક, ૨ બગડે બે, ૩ ત્રગડે ત્રણ, ૪ ચોગડે ચાર, ૫ પાંચડે પાંચ",
      "letterOrSymbol": "૧, ૨, ૩, ૪, ૫",
      "mediaEmojiOrIcon": "🖐️",
      "examples": [
        {"wordGujarati": "૧ એક સૂર્ય", "wordEnglish": "1 Sun", "imageEmoji": "☀️", "audioText": "એક સૂર્ય"},
        {"wordGujarati": "૨ બે આંખો", "wordEnglish": "2 Eyes", "imageEmoji": "👀", "audioText": "બે આંખો"},
        {"wordGujarati": "૩ ત્રણ પૈડાંવાળી રીક્ષા", "wordEnglish": "3 Rickshaw wheels", "imageEmoji": "🛺", "audioText": "ત્રણ પૈડાં"},
        {"wordGujarati": "૪ ચાર પગવાળી ગાય", "wordEnglish": "4 Cow legs", "imageEmoji": "🐄", "audioText": "ચાર પગ"},
        {"wordGujarati": "૫ હાથની પાંચ આંગળીઓ", "wordEnglish": "5 Fingers", "imageEmoji": "🖐️", "audioText": "પાંચ આંગળીઓ"}
      ],
      "conceptCard": {
        "title": "૧ થી ૫ ની ગણતરી",
        "explanationGujarati": "એક એક વસ્તુ ગણીને આગળ વધવું: ૧, ૨, ૩, ૪, ૫.",
        "visualHint": "🍎 + 🍎 + 🍎 = ૩ સફરજન",
        "steps": ["વસ્તુ પર આંગળી મૂકો", "એક એક કરીને મોટેથી ગણો", "છેલ્લી સંખ્યા એ કુલ સંખ્યા છે"]
      },
      "interactivePractice": [
        {
          "type": "count_objects",
          "promptGujarati": "અહીં કેટલા તારા ⭐ છે? (⭐ ⭐ ⭐)",
          "audioPrompt": "કેટલા તારા છે ગણો",
          "options": ["૩", "૨", "૪"],
          "correctAnswer": "૩",
          "hintGujarati": "૧, ૨, ૩ - કુલ ત્રણ તારા છે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M02-1",
        "questionType": "count_select",
        "promptGujarati": "ચિત્રમાં કેટલા સફરજન છે? 🍎 🍎",
        "options": [
          {"id": "opt1", "textGujarati": "૨ (બે)", "emoji": "2️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૧ (એક)", "emoji": "1️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૩ (ત્રણ)", "emoji": "3️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "એક અને બે - કુલ ૨ સફરજન છે."
      },
      {
        "questionId": "Q-M02-2",
        "questionType": "mcq",
        "promptGujarati": "એક હાથમાં કેટલી આંગળીઓ હોય છે?",
        "options": [
          {"id": "opt1", "textGujarati": "૫ (પાંચ)", "emoji": "🖐️", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૩ (ત્રણ)", "emoji": "3️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૨ (બે)", "emoji": "2️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "એક હાથમાં ૫ આંગળીઓ હોય છે."
      },
      {
        "questionId": "Q-M02-3",
        "questionType": "mcq",
        "promptGujarati": "'૩' પછી તરત કઈ સંખ્યા આવે?",
        "options": [
          {"id": "opt1", "textGujarati": "૪ (ચાર)", "emoji": "4️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૨ (બે)", "emoji": "2️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૫ (પાંચ)", "emoji": "5️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૧, ૨, ૩ પછી ૪ આવે."
      },
      {
        "questionId": "Q-M02-4",
        "questionType": "image_select",
        "promptGujarati": "કયા જૂથમાં ૪ દડા ⚽ છે?",
        "options": [
          {"id": "opt1", "textGujarati": "⚽ ⚽ ⚽ ⚽ (ચાર)", "emoji": "4️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "⚽ ⚽ (બે)", "emoji": "2️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "⚽ (એક)", "emoji": "1️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ચાર દડાનું જૂથ સાચું છે."
      },
      {
        "questionId": "Q-M02-5",
        "questionType": "true_false",
        "promptGujarati": "ગાયને ૪ પગ હોય છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ગાયને ચાર પગ હોય છે."
      }
    ]
  },
  {
    "code": "M-03",
    "subject": "mathematics",
    "grade": "balvatika",
    "stage": "પગલું ૩: ૧ થી ૯ સંખ્યાજ્ઞાન",
    "trackerColumnNumber": 3,
    "sequence": 3,
    "titleGujarati": "૧ થી ૯ સુધીની સંખ્યાઓ અને સરખામણી",
    "titleEnglish": "Numbers 1 to 9 and number comparison",
    "descriptionGujarati": "૧ થી ૯ સુધીની સંખ્યાઓ ક્રમમાં ગોઠવે છે અને કઈ સંખ્યા મોટી કે નાની છે તે નક્કી કરે છે.",
    "descriptionEnglish": "Compares single-digit numbers from 1 to 9.",
    "prerequisiteCompetencyCode": "M-02",
    "learningContent": {
      "headlineGujarati": "આજે આપણે ૧ થી ૯ સંખ્યાઓ શીખીશું 🎯",
      "instructionGujarati": "૧ થી ૯ સંખ્યાઓ બોલો: ૧, ૨, ૩, ૪, ૫, ૬, ૭, ૮, ૯.",
      "soundPhonicsText": "૬ છગડે છ, ૭ સાતડે સાત, ૮ આઠડે આઠ, ૯ નવડે નવ",
      "letterOrSymbol": "૧ થી ૯",
      "mediaEmojiOrIcon": "🎯",
      "examples": [
        {"wordGujarati": "૬ છ", "wordEnglish": "6 Six", "imageEmoji": "🎲", "audioText": "છગડે છ"},
        {"wordGujarati": "૭ સાત વાર", "wordEnglish": "7 Days", "imageEmoji": "📅", "audioText": "સાતડે સાત"},
        {"wordGujarati": "૮ આઠ", "wordEnglish": "8 Eight", "imageEmoji": "🐙", "audioText": "આઠડે આઠ"},
        {"wordGujarati": "૯ નવ", "wordEnglish": "9 Nine", "imageEmoji": "🎈", "audioText": "નવડે નવ"}
      ],
      "conceptCard": {
        "title": "મોટી અને નાની સંખ્યા",
        "explanationGujarati": "ગણતરીમાં જે સંખ્યા પછી આવે તે મોટી કહેવાય. જેમ કે ૭ એ ૩ કરતાં મોટી છે.",
        "visualHint": "૯ > ૭ > ૫ > ૩ > ૧",
        "steps": ["ક્રમ યાદ રાખો: ૧ ૨ ૩ ૪ ૫ ૬ ૭ ૮ ૯", "પછી આવતી સંખ્યા મોટી", "પહેલાં આવતી સંખ્યા નાની"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "૫ અને ૮ માં કઈ સંખ્યા મોટી છે?",
          "audioPrompt": "પાંચ અને આઠ માં મોટો અંક કયો?",
          "options": ["૮", "૫"],
          "correctAnswer": "૮",
          "hintGujarati": "૮ પાંચ કરતાં પછી આવે એટલે મોટી છે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M03-1",
        "questionType": "mcq",
        "promptGujarati": "સૌથી મોટી સંખ્યા કઈ છે?",
        "options": [
          {"id": "opt1", "textGujarati": "૯", "emoji": "9️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૪", "emoji": "4️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૨", "emoji": "2️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૧ થી ૯ માં ૯ સૌથી મોટી સંખ્યા છે."
      },
      {
        "questionId": "Q-M03-2",
        "questionType": "mcq",
        "promptGujarati": "૫ ની તરત પહેલાં કઈ સંખ્યા આવે?",
        "options": [
          {"id": "opt1", "textGujarati": "૪", "emoji": "4️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૬", "emoji": "6️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૭", "emoji": "7️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૫ પહેલાં ૪ આવે."
      },
      {
        "questionId": "Q-M03-3",
        "questionType": "mcq",
        "promptGujarati": "૬ અને ૮ ની વચ્ચે કઈ સંખ્યા આવે?",
        "options": [
          {"id": "opt1", "textGujarati": "૭", "emoji": "7️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૫", "emoji": "5️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૯", "emoji": "9️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૬, ૭, ૮ - વચ્ચે ૭ આવે."
      },
      {
        "questionId": "Q-M03-4",
        "questionType": "count_select",
        "promptGujarati": "કેટલા ફૂલ છે? 🌸 🌸 🌸 🌸 🌸 🌸",
        "options": [
          {"id": "opt1", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૪ (ચાર)", "emoji": "4️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૮ (આઠ)", "emoji": "8️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "કુલ ૬ ફૂલ છે."
      },
      {
        "questionId": "Q-M03-5",
        "questionType": "true_false",
        "promptGujarati": "૩ એ ૭ કરતાં નાની સંખ્યા છે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૩ પહેલાં આવે એટલે ૭ કરતાં નાની છે."
      }
    ]
  },
  {
    "code": "M-04",
    "subject": "mathematics",
    "grade": "grade_1",
    "stage": "સરવાળા: ૧ અંકના સરવાળા",
    "trackerColumnNumber": 11,
    "sequence": 4,
    "titleGujarati": "એક અંકનો એક અંક સાથે સરવાળો (જવાબ ૯ સુધી)",
    "titleEnglish": "Single-digit addition (sum up to 9)",
    "descriptionGujarati": "મૂર્ત વસ્તુઓ કે આંગળીઓના ઉપયોગથી બે જૂથ ભેગા કરી સરવાળો કરે છે (દા.ત. ૩ + ૨ = ૫).",
    "descriptionEnglish": "Adds two single-digit numbers using concrete objects.",
    "prerequisiteCompetencyCode": "M-03",
    "learningContent": {
      "headlineGujarati": "આજે આપણે સરવાળા શીખીશું ➕",
      "instructionGujarati": "સરવાળો એટલે વસ્તુઓ ભેગી કરવી અને કુલ ગણવી. નિશાની '+' છે.",
      "soundPhonicsText": "ત્રણ વત્તા બે બરાબર પાંચ",
      "letterOrSymbol": "➕",
      "mediaEmojiOrIcon": "➕",
      "examples": [
        {"wordGujarati": "૨ + ૧ = ૩", "wordEnglish": "2 + 1 = 3", "imageEmoji": "🍎", "audioText": "બે સફરજન અને એક સફરજન મળીને ત્રણ થાય"},
        {"wordGujarati": "૩ + ૨ = ૫", "wordEnglish": "3 + 2 = 5", "imageEmoji": "⭐", "audioText": "ત્રણ વત્તા બે બરાબર પાંચ"},
        {"wordGujarati": "૪ + ૪ = ૮", "wordEnglish": "4 + 4 = 8", "imageEmoji": "⚽", "audioText": "ચાર વત્તા ચાર બરાબર આઠ"}
      ],
      "conceptCard": {
        "title": "સરવાળાની રીત",
        "explanationGujarati": "પહેલા જૂથની વસ્તુઓ ગણો, તેમાં બીજા જૂથની વસ્તુઓ ઉમેરો. બધા ભેગા મળીને જે થાય તે સરવાળો છે.",
        "visualHint": "🟢🟢 + 🟢🟢🟢 = 🟢🟢🟢🟢🟢 (૫)",
        "steps": ["પહેલો અંક જુઓ", "બીજો અંક ઉમેરો", "કુલ ગણતરી કરી જવાબ મેળવો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "૪ + ૨ નો સાચો જવાબ કયો થાય?",
          "audioPrompt": "ચાર વત્તા બે કેટલા થાય?",
          "options": ["૬", "૫", "૭"],
          "correctAnswer": "૬",
          "hintGujarati": "૪ પછી બે ગણો: ૫, ૬."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M04-1",
        "questionType": "mcq",
        "promptGujarati": "૩ + ૩ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૫ (પાંચ)", "emoji": "5️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૭ (સાત)", "emoji": "7️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૩ + ૩ = ૬ થાય."
      },
      {
        "questionId": "Q-M04-2",
        "questionType": "mcq",
        "promptGujarati": "તમારી પાસે ૪ ચોકલેટ છે, મિત્રએ બીજી ૧ આપી. હવે કુલ કેટલી ચોકલેટ થઈ?",
        "options": [
          {"id": "opt1", "textGujarati": "૫ (પાંચ)", "emoji": "🍫", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૩ (ત્રણ)", "emoji": "3️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૪ + ૧ = ૫ ચોકલેટ."
      },
      {
        "questionId": "Q-M04-3",
        "questionType": "mcq",
        "promptGujarati": "૫ + ૦ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૫ (પાંચ)", "emoji": "5️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૦ (શૂન્ય)", "emoji": "0️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "કોઈપણ સંખ્યામાં શૂન્ય ઉમેરતાં તે જ સંખ્યા રહે."
      },
      {
        "questionId": "Q-M04-4",
        "questionType": "mcq",
        "promptGujarati": "૨ + ૫ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૭ (સાત)", "emoji": "7️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૮ (આઠ)", "emoji": "8️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૨ + ૫ = ૭ થાય."
      },
      {
        "questionId": "Q-M04-5",
        "questionType": "true_false",
        "promptGujarati": "૧ + ૧ = ૨ થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "એક અને એક બે થાય."
      }
    ]
  },
  {
    "code": "M-05",
    "subject": "mathematics",
    "grade": "grade_1",
    "stage": "બાદબાકી: ૧ અંકની બાદબાકી",
    "trackerColumnNumber": 16,
    "sequence": 5,
    "titleGujarati": "એક અંકની બાદબાકી (મૂર્ત વસ્તુઓથી ૯ સુધી)",
    "titleEnglish": "Single-digit subtraction up to 9",
    "descriptionGujarati": "આપેલ જૂથમાંથી અમુક વસ્તુઓ બાદ કરી બાકી રહેલી વસ્તુઓની ગણતરી કરે છે (દા.ત. ૫ - ૨ = ૩).",
    "descriptionEnglish": "Subtracts single-digit numbers using concrete models.",
    "prerequisiteCompetencyCode": "M-04",
    "learningContent": {
      "headlineGujarati": "આજે આપણે બાદબાકી શીખીશું ➖",
      "instructionGujarati": "બાદબાકી એટલે વસ્તુઓ ઓછી કરવી કે દૂર કરવી. નિશાની '-' છે.",
      "soundPhonicsText": "પાંચ ઓછા બે બરાબર ત્રણ",
      "letterOrSymbol": "➖",
      "mediaEmojiOrIcon": "➖",
      "examples": [
        {"wordGujarati": "૫ - ૨ = ૩", "wordEnglish": "5 - 2 = 3", "imageEmoji": "🎈", "audioText": "પાંચ ફુગ્ગામાંથી બે ફૂટી ગયા તો ત્રણ વધ્યા"},
        {"wordGujarati": "૪ - ૧ = ૩", "wordEnglish": "4 - 1 = 3", "imageEmoji": "🍎", "audioText": "ચાર સફરજનમાંથી એક ખાધું તો ત્રણ વધ્યા"},
        {"wordGujarati": "૬ - ૩ = ૩", "wordEnglish": "6 - 3 = 3", "imageEmoji": "⭐", "audioText": "છ ઓછા ત્રણ બરાબર ત્રણ"}
      ],
      "conceptCard": {
        "title": "બાદબાકીની રીત",
        "explanationGujarati": "કુલ વસ્તુઓમાંથી આપેલી સંખ્યા જેટલી વસ્તુઓ કાઢી નાખો. બાકી વધેલી વસ્તુઓ ગણો.",
        "visualHint": "🟢🟢🟢🟢🟢 માંથી બે કાઢો -> 🟢🟢🟢 (૩ વધ્યા)",
        "steps": ["કુલ સંખ્યા જુઓ", "બાદ કરવાની સંખ્યા ઓછી કરો", "બાકી રહેલી સંખ્યા લખો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "૭ - ૩ નો સાચો જવાબ કયો થાય?",
          "audioPrompt": "સાત ઓછા ત્રણ કેટલા થાય?",
          "options": ["૪", "૩", "૫"],
          "correctAnswer": "૪",
          "hintGujarati": "૭ માંથી ૩ જાય તો ૪ વધે."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M05-1",
        "questionType": "mcq",
        "promptGujarati": "૬ - ૨ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૪ (ચાર)", "emoji": "4️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૩ (ત્રણ)", "emoji": "3️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૫ (પાંચ)", "emoji": "5️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૬ માંથી ૨ બાદ કરતાં ૪ વધે."
      },
      {
        "questionId": "Q-M05-2",
        "questionType": "mcq",
        "promptGujarati": "ઝાડ પર ૫ પંખી બેઠા હતા. ૨ પંખી ઊડી ગયા. હવે ઝાડ પર કેટલા પંખી રહ્યા?",
        "options": [
          {"id": "opt1", "textGujarati": "૩ (ત્રણ)", "emoji": "🐦", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૪ (ચાર)", "emoji": "4️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૨ (બે)", "emoji": "2️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૫ - ૨ = ૩ પંખી."
      },
      {
        "questionId": "Q-M05-3",
        "questionType": "mcq",
        "promptGujarati": "૮ - ૮ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૦ (શૂન્ય)", "emoji": "0️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૧ (એક)", "emoji": "1️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૮ (આઠ)", "emoji": "8️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "સંખ્યામાંથી તે જ સંખ્યા બાદ કરતાં શૂન્ય (૦) આવે."
      },
      {
        "questionId": "Q-M05-4",
        "questionType": "mcq",
        "promptGujarati": "૯ - ૪ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૫ (પાંચ)", "emoji": "5️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૩ (ત્રણ)", "emoji": "3️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૯ - ૪ = ૫ થાય."
      },
      {
        "questionId": "Q-M05-5",
        "questionType": "true_false",
        "promptGujarati": "૪ - ૦ = ૪ થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "શૂન્ય બાદ કરતાં સંખ્યા તે જ રહે છે."
      }
    ]
  },
  {
    "code": "M-06",
    "subject": "mathematics",
    "grade": "grade_2",
    "stage": "બે અંકના સરવાળા અને કોયડા",
    "trackerColumnNumber": 23,
    "sequence": 6,
    "titleGujarati": "બે અંકના વદ્દી વગરના સરવાળા",
    "titleEnglish": "2-digit addition without carryover",
    "descriptionGujarati": "બે અંકની સંખ્યાઓના એકમ અને દશકના સ્થાન સમજી વદ્દી વગરના સરવાળા કરે છે (દા.ત. ૨૩ + ૧૪ = ૩૭).",
    "descriptionEnglish": "Performs two-digit addition without carryover using place value.",
    "prerequisiteCompetencyCode": "M-05",
    "learningContent": {
      "headlineGujarati": "આજે આપણે બે અંકના સરવાળા શીખીશું 🔢",
      "instructionGujarati": "એકમમાં એકમ ઉમેરો અને દશકમાં દશક ઉમેરો.",
      "soundPhonicsText": "ત્રેવીસ વત્તા ચૌદ બરાબર સાડત્રીસ",
      "letterOrSymbol": "૨૩ + ૧૪",
      "mediaEmojiOrIcon": "🧮",
      "examples": [
        {"wordGujarati": "૧૨ + ૧૫ = ૨૭", "wordEnglish": "12 + 15 = 27", "imageEmoji": "🧮", "audioText": "બાર વત્તા પંદર બરાબર સત્તાવીસ"},
        {"wordGujarati": "૨૦ + ૩૦ = ૫૦", "wordEnglish": "20 + 30 = 50", "imageEmoji": "🔟", "audioText": "વીસ વત્તા ત્રીસ બરાબર પચાસ"},
        {"wordGujarati": "૩૪ + ૨૩ = ૫૭", "wordEnglish": "34 + 23 = 57", "imageEmoji": "✨", "audioText": "ચોત્રીસ વત્તા ત્રેવીસ બરાબર સત્તાવન"}
      ],
      "conceptCard": {
        "title": "એકમ અને દશકનો સરવાળો",
        "explanationGujarati": "પહેલાં જમણી બાજુના એકમના અંકોનો સરવાળો કરો. પછી ડાબી બાજુના દશકના અંકોનો સરવાળો કરો.",
        "visualHint": "દશક (૨) એકમ (૩) + દશક (૧) એકમ (૪) = દશક (૩) એકમ (૭) -> ૩૭",
        "steps": ["એકમના અંકો ઉમેરો", "દશકના અંકો ઉમેરો", "કુલ સંખ્યા લખો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "૨૫ + ૧૨ = કેટલા થાય?",
          "audioPrompt": "પચીસ વત્તા બાર કેટલા થાય?",
          "options": ["૩૭", "૪૭", "૨૭"],
          "correctAnswer": "૩૭",
          "hintGujarati": "૫ + ૨ = ૭ અને ૨ + ૧ = ૩, એટલે ૩૭."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M06-1",
        "questionType": "mcq",
        "promptGujarati": "૩૨ + ૨૧ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૫૩", "emoji": "5️⃣3️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૫૧", "emoji": "5️⃣1️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૪૩", "emoji": "4️⃣3️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૨ + ૧ = ૩ અને ૩ + ૨ = ૫ -> ૫૩."
      },
      {
        "questionId": "Q-M06-2",
        "questionType": "mcq",
        "promptGujarati": "૪૦ + ૨૦ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૬૦", "emoji": "6️⃣0️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૫૦", "emoji": "5️⃣0️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૭૦", "emoji": "7️⃣0️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૪ દશક + ૨ દશક = ૬ દશક (૬૦)."
      },
      {
        "questionId": "Q-M06-3",
        "questionType": "mcq",
        "promptGujarati": "રાજુ પાસે ૧૫ લખોટી હતી, કાકાએ ૧૩ બીજી આપી. કુલ કેટલી લખોટી થઈ?",
        "options": [
          {"id": "opt1", "textGujarati": "૨૮", "emoji": "🎱", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૨૫", "emoji": "2️⃣5️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૧૮", "emoji": "1️⃣8️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૧૫ + ૧૩ = ૨૮ લખોટી."
      },
      {
        "questionId": "Q-M06-4",
        "questionType": "mcq",
        "promptGujarati": "૫૪ + ૨૩ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૭૭", "emoji": "7️⃣7️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૬૭", "emoji": "6️⃣7️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૮૭", "emoji": "8️⃣7️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૪ + ૩ = ૭ અને ૫ + ૨ = ૭ -> ૭૭."
      },
      {
        "questionId": "Q-M06-5",
        "questionType": "true_false",
        "promptGujarati": "૧૦ + ૧૦ = ૨૦ થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "દસ અને દસ વીસ થાય."
      }
    ]
  },
  {
    "code": "M-07",
    "subject": "mathematics",
    "grade": "grade_2",
    "stage": "ગુણાકાર અને ઘડિયા",
    "trackerColumnNumber": 28,
    "sequence": 7,
    "titleGujarati": "૨, ૩, ૫ અને ૧૦ નો ઘડિયો / પુનરાવર્તિત સરવાળો",
    "titleEnglish": "Multiplication tables of 2, 3, 5, 10",
    "descriptionGujarati": "પુનરાવર્તિત સરવાળા તરીકે ગુણાકાર સમજે છે અને ૨, ૩, ૫, ૧૦ ના ઘડિયાના ઉપયોગથી કોયડા ઉકેલે છે.",
    "descriptionEnglish": "Understands multiplication as repeated addition.",
    "prerequisiteCompetencyCode": "M-06",
    "learningContent": {
      "headlineGujarati": "આજે આપણે ઘડિયા અને ગુણાકાર શીખીશું ✖️",
      "instructionGujarati": "સરખી સંખ્યા વારંવાર ઉમેરવી એટલે ગુણાકાર. દા.ત. ૨ + ૨ + ૨ = ૩ વખત ૨ = ૬.",
      "soundPhonicsText": "બે એકા બે, બે દુ ચાર, બે તરી છ, બે ચોક આઠ, બે પંચા દસ",
      "letterOrSymbol": "✖️",
      "mediaEmojiOrIcon": "✖️",
      "examples": [
        {"wordGujarati": "૨ × ૩ = ૬", "wordEnglish": "2 x 3 = 6", "imageEmoji": "🍒", "audioText": "બે તરી છ"},
        {"wordGujarati": "૫ × ૨ = ૧૦", "wordEnglish": "5 x 2 = 10", "imageEmoji": "🖐️", "audioText": "પાંચ દુ દસ"},
        {"wordGujarati": "૧૦ × ૩ = ૩૦", "wordEnglish": "10 x 3 = 30", "imageEmoji": "🔟", "audioText": "દસ તરી ત્રીસ"}
      ],
      "conceptCard": {
        "title": "ગુણાકારનો અર્થ",
        "explanationGujarati": "જૂથમાં સરખી વસ્તુઓ હોય ત્યારે ઝડપથી ગણવા માટે ગુણાકાર થાય છે. ૨ × ૪ એટલે ૨ ના ૪ જૂથ = ૮.",
        "visualHint": "⭐⭐ + ⭐⭐ + ⭐⭐ = ૩ × ૨ = ૬",
        "steps": ["જૂથની સંખ્યા ગણો", "દરેક જૂથમાં કેટલી વસ્તુ છે તે જુઓ", "ઘડિયાનો ઉપયોગ કરી ગુણાકાર કરો"]
      },
      "interactivePractice": [
        {
          "type": "tap_match",
          "promptGujarati": "૨ × ૪ નો જવાબ શું થાય?",
          "audioPrompt": "બે ચોક કેટલા થાય?",
          "options": ["૮", "૬", "૧૦"],
          "correctAnswer": "૮",
          "hintGujarati": "૨ + ૨ + ૨ + ૨ = ૮."
        }
      ]
    },
    "questions": [
      {
        "questionId": "Q-M07-1",
        "questionType": "mcq",
        "promptGujarati": "૫ × ૩ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૧૫ (પંદર)", "emoji": "1️⃣5️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૧૦ (દસ)", "emoji": "1️⃣0️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૨૦ (વીસ)", "emoji": "2️⃣0️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૫ + ૫ + ૫ = ૧૫ થાય (૫ × ૩ = ૧૫)."
      },
      {
        "questionId": "Q-M07-2",
        "questionType": "mcq",
        "promptGujarati": "એક ગાયને ૪ પગ હોય તો ૨ ગાયના કુલ કેટલા પગ થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૮ (આઠ) - ૨ × ૪ = ૮", "emoji": "🐄", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૬ (છ)", "emoji": "6️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૧૦ (દસ)", "emoji": "🔟", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૪ + ૪ = ૮ (૨ × ૪ = ૮ પગ)."
      },
      {
        "questionId": "Q-M07-3",
        "questionType": "mcq",
        "promptGujarati": "૧૦ × ૫ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૫૦ (પચાસ)", "emoji": "5️⃣0️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૪૦ (ચાલીસ)", "emoji": "4️⃣0️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૬૦ (સાઈઠ)", "emoji": "6️⃣0️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૧૦ નો ઘડિયો: ૧૦ × ૫ = ૫૦."
      },
      {
        "questionId": "Q-M07-4",
        "questionType": "mcq",
        "promptGujarati": "૩ × ૪ = કેટલા થાય?",
        "options": [
          {"id": "opt1", "textGujarati": "૧૨ (બાર)", "emoji": "1️⃣2️⃣", "isCorrect": True},
          {"id": "opt2", "textGujarati": "૯ (નવ)", "emoji": "9️⃣", "isCorrect": False},
          {"id": "opt3", "textGujarati": "૧૪ (ચૌદ)", "emoji": "1️⃣4️⃣", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "૩ ચોક ૧૨ થાય."
      },
      {
        "questionId": "Q-M07-5",
        "questionType": "true_false",
        "promptGujarati": "૨ × ૫ અને ૫ × ૨ બંનેનો જવાબ ૧૦ જ આવે?",
        "options": [
          {"id": "opt1", "textGujarati": "હા (સાચું)", "emoji": "✅", "isCorrect": True},
          {"id": "opt2", "textGujarati": "ના (ખોટું)", "emoji": "❌", "isCorrect": False}
        ],
        "correctAnswerId": "opt1",
        "explanationGujarati": "ગુણાકારમાં ક્રમ બદલાય તો પણ જવાબ સરખો જ રહે."
      }
    ]
  }
]

# Write gujarati.json and mathematics.json
with open('server/seed/data/gujarati.json', 'w', encoding='utf-8') as f:
    json.dump(gujarati_competencies, f, ensure_ascii=False, indent=2)

with open('server/seed/data/mathematics.json', 'w', encoding='utf-8') as f:
    json.dump(math_competencies, f, ensure_ascii=False, indent=2)

# Achievements data
achievements = [
  {
    "badgeKey": "first_skill_mastered",
    "titleGujarati": "પ્રથમ સિદ્ધિ ⭐",
    "titleEnglish": "First Skill Mastered",
    "descriptionGujarati": "તમે તમારી પ્રથમ ક્ષમતામાં ૮૦% કે તેથી વધુ ગુણ મેળવી નિપુણ બન્યા!",
    "iconEmoji": "⭐"
  },
  {
    "badgeKey": "gujarati_explorer",
    "titleGujarati": "ગુજરાતી ભાષા વિજેતા 📖",
    "titleEnglish": "Gujarati Explorer",
    "descriptionGujarati": "ગુજરાતી વિષયમાં ૩ ક્ષમતાઓ પૂર્ણ કરી!",
    "iconEmoji": "📖"
  },
  {
    "badgeKey": "math_explorer",
    "titleGujarati": "ગણિત ગણીતજ્ઞ 🔢",
    "titleEnglish": "Math Explorer",
    "descriptionGujarati": "ગણિત વિષયમાં ૩ ક્ષમતાઓ પૂર્ણ કરી!",
    "iconEmoji": "🔢"
  },
  {
    "badgeKey": "learning_streak_3",
    "titleGujarati": "અવિરત શીખનાર 🔥",
    "titleEnglish": "Learning Streak (3 Days)",
    "descriptionGujarati": "સતત ૩ દિવસ સુધી અધ્યયન કર્યું!",
    "iconEmoji": "🔥"
  },
  {
    "badgeKey": "fln_champion",
    "titleGujarati": "નિપુણ ગુજરાત ચેમ્પિયન 🏆",
    "titleEnglish": "FLN Champion",
    "descriptionGujarati": "તમે FLN લક્ષ્યો હાંસલ કરી ઉત્કૃષ્ટ સિદ્ધિ નોંધાવી!",
    "iconEmoji": "🏆"
  }
]

with open('server/seed/data/achievements.json', 'w', encoding='utf-8') as f:
    json.dump(achievements, f, ensure_ascii=False, indent=2)

# Initial Users (Teachers, Classes, Students)
initial_users = {
  "teachers": [
    {
      "name": "વિનયભાઈ પટેલ (Vinay Patel)",
      "email": "teacher@nipun.gujarat.gov.in",
      "password": "Password@123",
      "teacherId": "GUJ-TCH-0042",
      "schoolName": "પ્રાથમિક શાળા સેક્ટર-૧, ગાંધીનગર",
      "schoolCode": "24060100101",
      "taluka": "ગાંધીનગર",
      "district": "ગાંધીનગર"
    }
  ],
  "classes": [
    {"name": "બાલવાટિકા - અ", "grade": "Balvatika", "section": "A"},
    {"name": "ધોરણ ૧ - અ", "grade": "Grade 1", "section": "A"},
    {"name": "ધોરણ ૨ - અ", "grade": "Grade 2", "section": "A"}
  ],
  "students": [
    {"uid": "NG-2026-001", "name": "રવિ પટેલ (Ravi Patel)", "gender": "Boy", "grade": "Grade 1", "section": "A", "classIndex": 1},
    {"uid": "NG-2026-002", "name": "કૃષા શાહ (Krisha Shah)", "gender": "Girl", "grade": "Grade 1", "section": "A", "classIndex": 1},
    {"uid": "NG-2026-003", "name": "આરવ પટેલ (Aarav Patel)", "gender": "Boy", "grade": "Grade 1", "section": "A", "classIndex": 1},
    {"uid": "NG-2026-004", "name": "દિયા પ્રજાપતિ (Diya Prajapati)", "gender": "Girl", "grade": "Grade 1", "section": "A", "classIndex": 1},
    {"uid": "NG-2026-005", "name": "યશ ચૌહાણ (Yash Chauhan)", "gender": "Boy", "grade": "Balvatika", "section": "A", "classIndex": 0},
    {"uid": "NG-2026-006", "name": "પ્રિયા ઠાકોર (Priya Thakor)", "gender": "Girl", "grade": "Balvatika", "section": "A", "classIndex": 0},
    {"uid": "NG-2026-007", "name": "હર્ષ વાઘેલા (Harsh Vaghela)", "gender": "Boy", "grade": "Grade 2", "section": "A", "classIndex": 2},
    {"uid": "NG-2026-008", "name": "અનન્યા દેસાઈ (Ananya Desai)", "gender": "Girl", "grade": "Grade 2", "section": "A", "classIndex": 2}
  ]
}

with open('server/seed/data/initial_users.json', 'w', encoding='utf-8') as f:
    json.dump(initial_users, f, ensure_ascii=False, indent=2)

print('Seed JSON files generated successfully!')
