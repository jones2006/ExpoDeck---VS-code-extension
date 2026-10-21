import * as vscode from "vscode";
import { EXPO_COMMANDS, ExpoCommand } from "./commands";

class ExpoCommandItem extends vscode.TreeItem {
  constructor(public readonly expoCmd: ExpoCommand) {
    super(expoCmd.label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = new vscode.MarkdownString(
      `**Command:** \`${expoCmd.commandText}\`\n\n*${expoCmd.descriptionText}*`,
    );
    this.description = expoCmd.descriptionText;
    this.contextValue = "expoCommand";
    this.iconPath = new vscode.ThemeIcon("terminal");
  }
}

class ExpoDeckTreeProvider implements vscode.TreeDataProvider<ExpoCommandItem> {
  getTreeItem(element: ExpoCommandItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<ExpoCommandItem[]> {
    const items = EXPO_COMMANDS.map((cmd) => new ExpoCommandItem(cmd));
    return Promise.resolve(items);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // 1. Register Sidebar Tree View
  const treeProvider = new ExpoDeckTreeProvider();
  vscode.window.registerTreeDataProvider(
    "expodeck-commands-view",
    treeProvider,
  );

  // 2. Command to Run in Terminal
  let runCmdDisposable = vscode.commands.registerCommand(
    "expodeck.runCommand",
    async (item: ExpoCommandItem | ExpoCommand) => {
      let commandText = "";

      // Check if it's a TreeItem (ExpoCommandItem) or raw object (ExpoCommand)
      if (item instanceof ExpoCommandItem) {
        commandText = item.expoCmd.commandText;
      } else {
        commandText = item.commandText;
      }

      if (commandText === "npx expo install ") {
        const pkg = await vscode.window.showInputBox({
          prompt: "Enter package name to install",
          placeHolder: "e.g., expo-image or react-native-safe-area-context",
        });
        if (!pkg) {
          return;
        }
        commandText = `npx expo install ${pkg}`;
      }

      let terminal = vscode.window.terminals.find((t) => t.name === "ExpoDeck");
      if (!terminal) {
        terminal = vscode.window.createTerminal("ExpoDeck");
      }
      terminal.show();
      terminal.sendText(commandText);
    },
  );

  // 3. Command to Copy to Clipboard
  let copyCmdDisposable = vscode.commands.registerCommand(
    "expodeck.copyCommand",
    async (item: ExpoCommandItem) => {
      let cmdToCopy = item.expoCmd.commandText;
      if (cmdToCopy === "npx expo install ") {
        cmdToCopy = "npx expo install <package-name>";
      }
      await vscode.env.clipboard.writeText(cmdToCopy);
      vscode.window.showInformationMessage(`Copied: ${cmdToCopy}`);
    },
  );

  // 4. Quick Pick Search Menu (Ctrl+Alt+E)
  let quickPickDisposable = vscode.commands.registerCommand(
    "expodeck.openQuickPick",
    async () => {
      const quickPickItems = EXPO_COMMANDS.map((cmd) => ({
        label: cmd.commandText,
        description: cmd.descriptionText,
        original: cmd,
      }));

      const selected = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: "⚡ Type to search Expo commands...",
      });

      if (!selected) {
        return;
      }

      let finalCommand = selected.label;
      if (
        finalCommand.includes("<package>") ||
        finalCommand === "npx expo install "
      ) {
        const pkg = await vscode.window.showInputBox({
          prompt: "Enter package name to install",
          placeHolder: "e.g., expo-image",
        });
        if (!pkg) {
          return;
        }
        finalCommand = `npx expo install ${pkg}`;
      }

      let terminal = vscode.window.terminals.find((t) => t.name === "ExpoDeck");
      if (!terminal) {
        terminal = vscode.window.createTerminal("ExpoDeck");
      }
      terminal.show();
      terminal.sendText(finalCommand);
    },
  );

  context.subscriptions.push(
    runCmdDisposable,
    copyCmdDisposable,
    quickPickDisposable,
  );
}

export function deactivate() {}
