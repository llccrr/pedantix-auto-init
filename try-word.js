(async function() {
    // Liste des petits mots à tester (Français, Anglais, Espagnol, Allemand, Italien)
    const petitsMots = [
        // Français
        'le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'et', 'ou', 'où', 'à',
        'en', 'dans', 'par', 'pour', 'avec', 'sans', 'sous', 'sur', 'chez', 'mais',
        'donc', 'or', 'ni', 'car', 'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous',
        'ils', 'elles', 'qui', 'que', 'quoi', 'dont', 'leur', 'lui', 'se', 'y',
        'ce', 'cet', 'cette', 'ces', 'mon', 'ton', 'son', 'notre', 'votre', 'leur',
        'moi', 'toi', 'soi', 'là', 'ci', 'ne', 'pas', 'plus', 'moins', 'trop', 'très',
    ];

    // Fonction pour attendre un certain temps (en millisecondes)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Sélectionner le formulaire, le champ de saisie et le bouton de soumission
    const form = document.getElementById('pedantix-form');
    const inputField = form ? form.querySelector('.guessbox input') : null;
    const submitButton = document.getElementById('pedantix-guess-btn');

    if (!inputField || !submitButton) {
        console.error("Impossible de trouver le champ de saisie ou le bouton de soumission.");
        return;
    }

    // Fonction pour définir la valeur de l'input en utilisant le setter natif
    const setNativeValue = (element, value) => {
        const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value').set;
        if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            element.value = value;
        }
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    };

    // Fonction pour simuler un clic complet sur un élément
    const simulateClick = (element) => {
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        });
    };

    // Fonction pour simuler la saisie d'un mot caractère par caractère
    const typeWord = async (word) => {
        inputField.focus();
        setNativeValue(inputField, '');

        for (let char of word) {
            inputField.value += char;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(100); // Ajustez la vitesse de saisie si nécessaire
        }
    };

    for (let mot of petitsMots) {
        await typeWord(mot);

        // Simuler l'appui sur la touche 'Enter'
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        inputField.dispatchEvent(enterEvent);

        const enterEvent2 = new KeyboardEvent('keyup', {
            key: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        inputField.dispatchEvent(enterEvent2);

        // Simuler un clic complet sur le bouton de soumission
        simulateClick(submitButton);

        console.log(`Mot soumis : ${mot}`);

        // Attendre un délai avant de soumettre le mot suivant
        await sleep(100); // Ajustez le délai en fonction des performances du site
    }

    console.log("Tous les petits mots ont été testés.");
})();