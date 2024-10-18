const puppeteer = require('puppeteer');

const launchGameInit =async () => {
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

    // Délai entre les actions en millisecondes
    const DELAY_BETWEEN_WORDS = 2000; // 2 secondes
    const DELAY_BETWEEN_CHARS = 100; // 0.1 seconde

    // Lancer le navigateur
    const browser = await puppeteer.launch({
        headless: false, // Définir à 'true' pour exécuter en mode headless
        defaultViewport: null, // Pour utiliser la taille de la fenêtre par défaut
        args: ['--start-maximized'] // Ouvrir en plein écran
    });

    const page = await browser.newPage();

    // Naviguer vers le site Pedantix
    await page.goto('https://cemantix.certitudes.org/pedantix', {
        waitUntil: 'networkidle2'
    });

    // Attendre que le formulaire soit disponible
    await page.waitForSelector('#pedantix-form');


    await page.waitForSelector('.fc-button.fc-cta-consent.fc-primary-button', {
        visible: true,
        timeout: 10000 // Temps d'attente maximal de 10 secondes
    });
    console.log('Bouton de consentement trouvé. Cliquez dessus...');
    await page.click('.fc-button.fc-cta-consent.fc-primary-button');
    await page.waitForSelector('#dialog-close', {
        visible: true,
        timeout: 10000 // Temps d'attente maximal de 10 secondes
    });
    await page.click('#dialog-close');
    console.log('Bouton de consentement cliqué avec succès.');

    // Fonction pour taper un mot caractère par caractère
    const typeWord = async (word) => {
        const inputSelector = '#pedantix-form .guessbox input';
        await page.focus(inputSelector);
        await page.click(inputSelector, { clickCount: 3 }); // Sélectionner tout le texte existant
        await page.keyboard.press('Backspace'); // Effacer le champ de saisie

        for (const char of word) {
            await page.keyboard.type(char);
            // await page.waitForTimeout(DELAY_BETWEEN_CHARS);
        }
    };
    //
    // // Fonction pour soumettre le mot
    const submitWord = async () => {
        const submitSelector = '#pedantix-guess-btn';
        await page.click(submitSelector);
    };
    //
    // // Boucle pour tester chaque mot
    for (const mot of petitsMots) {
        console.log(`Soumission du mot : ${mot}`);
        await typeWord(mot);
        await submitWord();

        // Attendre un délai avant de soumettre le mot suivant
        // await page.waitForTimeout(DELAY_BETWEEN_WORDS);
    }

    await page.waitForSelector('#cloud-button', {
        visible: true,
        timeout: 10000 // Temps d'attente maximal de 10 secondes
    });
    await page.click('#cloud-button');
    await page.waitForSelector('#start', {
        visible: true,
        timeout: 10000 // Temps d'attente maximal de 10 secondes
    });
    await page.click('#start');


    await page.waitForSelector('.teamcode', {
        visible: true,
        timeout: 10000 // Temps d'attente maximal de 10 secondes
    });

    // document.getElementsByClassName("teamcode")[0].innerText
    const teamCode = await page.evaluate(() => {
        const elements = document.getElementsByClassName('teamcode');
        if (elements.length > 0) {
            return elements[0].innerText;
        } else {
            return null;
        }
    });
    console.log(teamCode);

    await browser.close();
    return teamCode;
}


module.exports = launchGameInit;
