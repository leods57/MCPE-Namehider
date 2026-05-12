import { world, system } from "@minecraft/server";

world.beforeEvents.chatSend.subscribe((eventData) => {
    const { message, sender } = eventData;

    if (message.toLowerCase().startsWith("/nametag")) {
        // Cancel the message so it stays private
        eventData.cancel = true;

        // PERMISSION CHECK: Only players with the 'Creator' tag can use this
        if (!sender.hasTag("Creator")) {
            sender.sendMessage("§cYou do not have permission to use this command.");
            return;
        }

        const args = message.split(" ");
        if (args.length < 3) {
            sender.sendMessage("§cUsage: /nametag <player> <visible/invisible>");
            return;
        }

        const targetName = args[1];
        const mode = args[2].toLowerCase();
        
        // Find the target player by name
        const targetPlayer = world.getAllPlayers().find(p => p.name === targetName);

        if (!targetPlayer) {
            sender.sendMessage(`§cPlayer "${targetName}" not found.`);
            return;
        }

        if (mode === "invisible") {
            targetPlayer.addTag("hide_name");
            sender.sendMessage(`§aNametag for ${targetName} is now hidden.`);
        } else if (mode === "visible") {
            targetPlayer.removeTag("hide_name");
            targetPlayer.nameTag = targetPlayer.name; 
            sender.sendMessage(`§aNametag for ${targetName} is now visible.`);
        } else {
            sender.sendMessage("§cInvalid mode. Use 'visible' or 'invisible'.");
        }
    }
});

// The "No Matter What" loop
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.hasTag("hide_name")) {
            if (player.nameTag !== "") {
                player.nameTag = "";
            }
        }
    }
}, 1);
