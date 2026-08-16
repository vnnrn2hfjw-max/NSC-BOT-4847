module.exports = {
    name: "messageCreate",

    async execute(message) {

        if (message.author.bot) return;

        const command = message.content.trim().toLowerCase();

        // ==========================================
        // TEST
        // ==========================================

        if (command === "!test") {
            return message.channel.send(
                "Trigger system is working."
            );
        }

        // ==========================================
        // GROUP
        // ==========================================

        if (command === "!group") {
            return message.channel.send(
                "https://www.roblox.com/share/g/926022365"
            );
        }

        // ==========================================
        // PRICES
        // ==========================================

        if (command === "!prices") {

            const text = `# NSC PRICES

#  :emoji_12: __NSC | OFFICIAL MARKET__ :emoji_12: 



:Diamond_Red: ╔══════〔 ACCESS 〕══════╗:Diamond_Red: 

* Free Access — FREE
* Half Access — 350 Robux | $3.50
* Full Access — 600 Robux | $8
* Name Skip — 150 Robux | $1.50

╚══════════════════╝

:Red_StaffBadge: ╔══════〔 STAFF 〕══════╗:Red_StaffBadge: 

* Trial Moderator — $10
* Junior Moderator — $20
* Moderator — $30
* Head Moderator — $50

╚══════════════════╝

:MoneyBag: ╔══〔 ADMINISTRATION 〕══╗:MoneyBag: 

* Admin in Training — $60
* Administrator — $90
* Senior Administrator — $125
* Head Admin — $160
* Head of Staff — $200
* Chief of Staff — $250

╚══════════════════╝

:emoji_23: ╔══〔 SUPERVISION 〕══╗:emoji_23: 

* Assistant Supervisor — $275
* Staff Supervisor — $300
* Head Supervisor — $325

╚══════════════════╝

:emoji_17: ╔════〔 HR 〕════╗:emoji_17: 

* Management — $350
* Head of Management — $375
* Executive Director — $400
* 3rd in Command — $425
* 2nd in Command — $450
* 1st in Command — $475

╚══════════════════╝

:emoji_16: ╔══〔 ADD-ONS 〕══╗:emoji_16: 

* Pic Perms — $3
* Custom Role — $10
* Private VC — $15
* Role + Private VC — $20

╚══════════════════╝

:MoneyBag: ╔══〔 PAYMENTS 〕══╗:MoneyBag: 

* PayPal
* Robux
* Server Boosts
* Gift Cards

╚══════════════════╝

:crown002: ╔══〔 TERMS 〕══╗:crown002: 

* No refunds.
* Buy only from authorized sellers.
* Trial required for staff ranks.
* Purchases do not guarantee permission
.`;

            return message.channel.send({
                content: text,
                allowedMentions: {
                    parse: []
                }
            });
        }

        // ==========================================
        // ACCESS
        // ==========================================

        if (command === "!access") {

            const text = `# NSC | NO SECOND CHANCES

### OFFICIAL MEMBERSHIP REQUIREMENTS

> **WELCOME TO NSC**
>
> **NSC | No Second Chances** is a respected and rapidly growing gang built upon **loyalty, discipline, activity, respect, and commitment.**
>
> Membership is earned. Before requesting entry, you must complete **ALL requirements** below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## REQUIREMENTS

**01 | OFFICIAL ROBLOX GROUP**

Join the official NSC Roblox Group:
> https://www.roblox.com/share/g/926022365

**02 | FOLLOW OWNERS**

Follow both official NSC owners:

> Darius — https://www.roblox.com/users/5782622558/profile
> Blastyed — https://www.roblox.com/users/3025544313/profile

**03 | NSC IDENTIFICATION**

Add **NSC** or **666** to both your Roblox and Discord names.

**04 | ACCOUNT AGE**

Your Roblox account must be **at least 1 month old**.

**05 | RULES**

Read and understand **all NSC rules**:
> <#1502687087584084038>

Failure to follow NSC rules may result in disciplinary action.

**06 | ACTIVITY**

React to the **4 most recent Activity Checks**:
> <#1524048971667079178>

**07 | BADGES**

Your Roblox account must contain **at least one full page of badges**.

Your Roblox inventory must be set to **PUBLIC** so Staff can verify your account.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## APPLICATION PROCESS

Once **ALL requirements** have been completed:

> **Open an NSC Join Ticket.**
> **Provide clear proof of every requirement.**
> **Wait for an authorized Staff member to review your application.**

Applications containing missing, misleading, or unverifiable information may be denied or returned.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## NSC STANDARD

Joining NSC means carrying the **NSC name** and representing the gang.

Every member is expected to remain:

**LOYAL • ACTIVE • RESPECTFUL • DISCIPLINED • COMMITTED**

**Earn your place.**
**Prove your loyalty.**
**Represent NSC.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# NSC | NO SECOND CHANCES`;

            return sendLongMessage(
                message.channel,
                text
            );
        }

        // ==========================================
        // SPANISH ACCESS
        // ==========================================

        if (command === "!saccess") {

            const text = `# NSC | NO SECOND CHANCES

### REQUISITOS OFICIALES DE MEMBRESÍA

> **BIENVENIDO A NSC**
>
> **NSC | No Second Chances** es una pandilla respetada y en rápido crecimiento, construida sobre **lealtad, disciplina, actividad, respeto y compromiso.**
>
> La membresía se gana. Antes de solicitar el ingreso, debes completar **TODOS los requisitos**.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## REQUISITOS

**01 | GRUPO OFICIAL DE ROBLOX**

Únete al Grupo Oficial de Roblox de NSC:
> https://www.roblox.com/share/g/926022365

**02 | SEGUIR A LOS DUEÑOS**

Sigue a los propietarios oficiales de NSC:

> Darius — https://www.roblox.com/users/5782622558/profile
> Blastyed — https://www.roblox.com/users/3025544313/profile

**03 | IDENTIFICACIÓN NSC**

Añade **NSC** o **666** tanto a tu nombre de Roblox como a tu nombre de Discord.

**04 | ANTIGÜEDAD DE LA CUENTA**

Tu cuenta de Roblox debe tener **al menos 1 mes de antigüedad**.

**05 | REGLAS**

Lee y comprende **todas las reglas de NSC**:
> <#1502687087584084038>

**06 | ACTIVIDAD**

Reacciona a las **4 comprobaciones de actividad más recientes**:
> <#1524048971667079178>

**07 | INSIGNIAS**

Tu cuenta de Roblox debe tener **al menos una página completa de insignias**.

Tu inventario de Roblox debe estar configurado como **PÚBLICO** para que el Staff pueda verificar tu cuenta.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## PROCESO DE SOLICITUD

Una vez que hayas completado **TODOS los requisitos**:

> **Abre un Ticket de Ingreso a NSC.**
> **Proporciona pruebas claras de cada requisito.**
> **Espera a que un miembro autorizado del Staff revise tu solicitud.**

Las solicitudes con información incompleta, engañosa o que no pueda ser verificada pueden ser rechazadas o devueltas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ESTÁNDAR DE NSC

Unirte a NSC significa llevar el **nombre de NSC** y representar a la pandilla.

Se espera que cada miembro sea:

**LEAL • ACTIVO • RESPETUOSO • DISCIPLINADO • COMPROMETIDO**

**Gana tu lugar.**
**Demuestra tu lealtad.**
**Representa a NSC.**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# NSC | NO SECOND CHANCES`;

            return sendLongMessage(
                message.channel,
                text
            );
        }
    }
};


// ==========================================
// LONG MESSAGE FUNCTION
// ==========================================

async function sendLongMessage(channel, text) {

    const MAX_LENGTH = 2000;

    while (text.length > MAX_LENGTH) {

        let splitAt =
            text.lastIndexOf(
                "\n",
                MAX_LENGTH
            );

        if (splitAt <= 0) {
            splitAt = MAX_LENGTH;
        }

        const part =
            text.substring(
                0,
                splitAt
            );

        await channel.send({
            content: part,
            allowedMentions: {
                parse: []
            }
        });

        text =
            text.substring(
                splitAt
            ).trim();
    }

    if (text.length > 0) {

        await channel.send({
            content: text,
            allowedMentions: {
                parse: []
            }
        });
    }
}
