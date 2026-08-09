// ==============================
// NSC TRIGGER SYSTEM
// ==============================

async function sendLongMessage(channel, text) {
    const MAX_LENGTH = 2000;

    if (text.length <= MAX_LENGTH) {
        return channel.send(text);
    }

    let remaining = text;

    while (remaining.length > MAX_LENGTH) {
        let splitAt = remaining.lastIndexOf("\n", MAX_LENGTH);

        if (splitAt <= 0) {
            splitAt = MAX_LENGTH;
        }

        await channel.send(remaining.slice(0, splitAt));
        remaining = remaining.slice(splitAt).trimStart();
    }

    if (remaining.length > 0) {
        await channel.send(remaining);
    }
}


// ==============================
// TRIGGERS
// ==============================

const triggers = {

    ",access": `# <a:Red_Crown:1483487368282374246> <a:BLACK_CROSS:1535722063996657676> __NSC | NO SECOND CHANCES__ <a:BLACK_CROSS:1535722063996657676> <a:Red_Crown:1483487368282374246>

### <:Black_Sparkle_Crown:1443171402814591037> __OFFICIAL MEMBERSHIP REQUIREMENTS__

> <a:crown_black:1528862538765176922> **WELCOME TO NSC**
>
> **NSC | No Second Chances** is a respected and rapidly growing gang built upon **loyalty, discipline, activity, respect, and commitment.**
>
> Membership is earned. Before requesting entry, you must complete **ALL requirements** below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <a:black:1491054403829108877> __REQUIREMENTS__ <a:black:1491054403829108877>

**<a:Animatedgun:1475190665645129860> 01 | OFFICIAL ROBLOX GROUP**

Join the official NSC Roblox Group:
> https://www.roblox.com/share/g/926022365

**<a:red_m4a1:1492343878064275576> 02 | FOLLOW OWNERS**

Follow both official NSC owners:
> [Darius](https://www.roblox.com/users/5782622558/profile)
> [Blastyed](https://www.roblox.com/users/3025544313/profile)

**<:11act:1535721705836642424> 03 | NSC IDENTIFICATION**

Add **NSC** or **666** to both your Roblox and Discord names.

**<a:BLACK_CROSS:1535722063996657676> 04 | ACCOUNT AGE**

Your Roblox account must be **at least 1 month old**.

**<a:Black_Planet:1535722235770310658> 05 | RULES**

Read and understand **all NSC rules**:
> <#1502687087584084038>

Failure to follow NSC rules may result in disciplinary action.

**<:shiny_red_shield:1526960458458988724> 06 | ACTIVITY**

React to the **4 most recent Activity Checks**:
> <#1524048971667079178>

**<a:black_diamond:1442514695633371178> 07 | BADGES**

Your Roblox account must contain **at least one full page of badges**.

Your Roblox inventory must be set to **PUBLIC** so Staff can verify your account.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <a:RED_INS_Verify:1092149695217946664> __APPLICATION PROCESS__ <a:RED_INS_Verify:1092149695217946664>

Once **ALL requirements** have been completed:

> <a:red:1359058496527794216> **Open an NSC Join Ticket.**
> <a:red:1359058496527794216> **Provide clear proof of every requirement.**
> <a:red:1359058496527794216> **Wait for an authorized Staff member to review your application.**

<a:redverifycross:1449461247836950750> **Applications containing missing, misleading, or unverifiable information may be denied or returned.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <:Black_Sparkle_Crown:1443171402814591037> __NSC STANDARD__ <:Black_Sparkle_Crown:1443171402814591037>

Joining NSC means carrying the **NSC name** and representing the gang.

Every member is expected to remain:

**LOYAL • ACTIVE • RESPECTFUL • DISCIPLINED • COMMITTED**

<a:gs_red_flames:1527623825590587424> **Earn your place.**
<a:gs_red_flames:1527623825590587424> **Prove your loyalty.**
<a:gs_red_flames:1527623825590587424> **Represent NSC.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# <a:Red_Crown:1535721885403324486> __NSC | NO SECOND CHANCES__ <a:Red_Crown:1535721885403324486>`,



    ",saccess": `# <a:Red_Crown:1483487368282374246> <a:BLACK_CROSS:1535722063996657676> __NSC | NO SECOND CHANCES__ <a:BLACK_CROSS:1535722063996657676> <a:Red_Crown:1483487368282374246>

### <:Black_Sparkle_Crown:1443171402814591037> __REQUISITOS OFICIALES DE MEMBRESÍA__

> <a:crown_black:1528862538765176922> **BIENVENIDO A NSC**
>
> **NSC | No Second Chances** es una pandilla respetada y en rápido crecimiento, construida sobre **lealtad, disciplina, actividad, respeto y compromiso.**
>
> La membresía se gana. Antes de solicitar el ingreso, debes completar **TODOS los requisitos** indicados a continuación.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <a:black:1491054403829108877> __REQUISITOS__ <a:black:1491054403829108877>

**<a:Animatedgun:1475190665645129860> 01 | GRUPO OFICIAL DE ROBLOX**

Únete al Grupo Oficial de Roblox de NSC:
> https://www.roblox.com/share/g/926022365

**<a:red_m4a1:1492343878064275576> 02 | SEGUIR A LOS DUEÑOS**

Sigue a los dos propietarios oficiales de NSC:
> [Darius](https://www.roblox.com/users/5782622558/profile)
> [Blastyed](https://www.roblox.com/users/3025544313/profile)

**<:11act:1535721705836642424> 03 | IDENTIFICACIÓN NSC**

Añade **NSC** o **666** tanto a tu nombre de Roblox como a tu nombre de Discord.

**<a:BLACK_CROSS:1535722063996657676> 04 | ANTIGÜEDAD DE LA CUENTA**

Tu cuenta de Roblox debe tener **al menos 1 mes de antigüedad**.

**<a:Black_Planet:1535722235770310658> 05 | REGLAS**

Lee y comprende **todas las reglas de NSC**:
> <#1502687087584084038>

El incumplimiento de las reglas de NSC puede resultar en medidas disciplinarias.

**<:shiny_red_shield:1526960458458988724> 06 | ACTIVIDAD**

Reacciona a las **4 comprobaciones de actividad más recientes**:
> <#1524048971667079178>

**<a:black_diamond:1442514695633371178> 07 | INSIGNIAS**

Tu cuenta de Roblox debe tener **al menos una página completa de insignias**.

Tu inventario de Roblox debe estar configurado como **PÚBLICO** para que el Staff pueda verificar tu cuenta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <a:RED_INS_Verify:1092149695217946664> __PROCESO DE SOLICITUD__ <a:RED_INS_Verify:1092149695217946664>

Una vez que hayas completado **TODOS los requisitos**:

> <a:red:1359058496527794216> **Abre un Ticket de Ingreso a NSC.**
> <a:red:1359058496527794216> **Proporciona pruebas claras de cada requisito.**
> <a:red:1359058496527794216> **Espera a que un miembro autorizado del Staff revise tu solicitud.**

<a:redverifycross:1449461247836950750> **Las solicitudes con información incompleta, engañosa o que no pueda ser verificada pueden ser rechazadas o devueltas.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## <:Black_Sparkle_Crown:1443171402814591037> __ESTÁNDAR DE NSC__ <:Black_Sparkle_Crown:1443171402814591037>

Unirte a NSC significa llevar el **nombre de NSC** y representar a la pandilla.

Se espera que cada miembro sea:

**LEAL • ACTIVO • RESPETUOSO • DISCIPLINADO • COMPROMETIDO**

<a:gs_red_flames:1527623825590587424> **Gana tu lugar.**
<a:gs_red_flames:1527623825590587424> **Demuestra tu lealtad.**
<a:gs_red_flames:1527623825590587424> **Representa a NSC.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# <a:Red_Crown:1535721885403324486> __NSC | NO SECOND CHANCES__ <a:Red_Crown:1535721885403324486>`,



    ",Roblox": `https://www.roblox.com/share/g/926022365`,



    ",prices": `# <a:Red_Crown:1483487368282374246> NSC PRICES <a:Red_Crown:1483487368282374246>

## <a:Animatedgun:1475190665645129860> ACCESS

> - Free Access — FREE
> - Half Access — 350 Robux | $3.50
> - Full Access — 600 Robux | $8
> - Name Skip — 150 Robux | $1.50

## <a:RED_INS_Verify:1092149695217946664> STAFF RANKS

-# Limited spots
- **Trial required before permissions are given.**

> - Chief of Staff — $250
> - Manager — $200
> - Head Admin — $160
> - Senior Admin — $125
> - Admin — $90
> - Ranker — $60
> - Head Moderator — $50
> - Senior Moderator — $40
> - Moderator — $30
> - Junior Moderator — $20
> - Trial Moderator — $10

## <a:black_diamond:1442514695633371178> EXTRA

> - Link Perms — $3
> - Pic Perms — $3
> - Custom Role — $10
> - Private VC — $15
> - Custom Role + Private VC Bundle — $20 (Best Value)

## <a:RED_INS_Verify:1092149695217946664> PAYMENTS

> - PayPal (Friends & Family ONLY)
> - Robux
> - Server Boosts
> - Gift Cards (Robux, PS5 & App Store)

## <a:BLACK_CROSS:1535722063996657676> TERMS AND CONDITIONS

> **Only buy from a Trusted Seller, Owner, or Founder.**
> **Do NOT send payment until your purchase has been confirmed.**
> No refunds.
> Trial is still required for staff ranks.
> Abuse of purchased roles may result in removal without a refund.
> Leadership roles are **not for sale**.
> All purchases are final.`
};


// ==============================
// MESSAGE EVENT
// ==============================

module.exports = {
    name: "messageCreate",

    async execute(message) {

        // Ignore bots
        if (message.author.bot) return;

        const content = message.content.trim().toLowerCase();

        // Find matching trigger
        const trigger = Object.keys(triggers).find(
            key => key.toLowerCase() === content
        );

        if (!trigger) return;

        try {
            await sendLongMessage(
                message.channel,
                triggers[trigger]
            );

            console.log(
                `⚡ Trigger used: ${trigger} by ${message.author.tag}`
            );

        } catch (error) {
            console.error(
                `❌ Trigger error (${trigger}):`,
                error
            );
        }
    }
};
