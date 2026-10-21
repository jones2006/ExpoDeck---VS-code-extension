import * as vscode from "vscode";
import { EXPO_COMMANDS, ExpoCommand } from "./commands";

class ExpoCommandItem extends vscode.TreeItem {
  constructor(
    public readonly expoCmd: ExpoCommand,
    public readonly isCustom: boolean = false,
  ) {
    super(expoCmd.label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = new vscode.MarkdownString(
      `**Command:** \`${expoCmd.commandText}\`\n\n*${expoCmd.descriptionText}*`,
    );
    this.description = expoCmd.descriptionText;

    // Daytoy ti mangilasin no custom command tapno agpakita ti Trash/Delete button
    this.contextValue = isCustom ? "customExpoCommand" : "defaultExpoCommand";
    this.iconPath = new vscode.ThemeIcon(isCustom ? "tools" : "terminal");
  }
}

class ExpoDeckTreeProvider implements vscode.TreeDataProvider<ExpoCommandItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ExpoCommandItem | undefined | null | void
  > = new vscode.EventEmitter<ExpoCommandItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ExpoCommandItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ExpoCommandItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<ExpoCommandItem[]> {
    const config = vscode.workspace.getConfiguration("expodeck");
    const customCommands: ExpoCommand[] =
      config.get<ExpoCommand[]>("customCommands") || [];

    const defaultItems = EXPO_COMMANDS.map(
      (cmd) => new ExpoCommandItem(cmd, false),
    );
    const customItems = customCommands.map(
      (cmd) => new ExpoCommandItem(cmd, true),
    );

    return Promise.resolve([...defaultItems, ...customItems]);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // 1. Register Sidebar Tree View
  const treeProvider = new ExpoDeckTreeProvider();
  vscode.window.registerTreeDataProvider(
    "expodeck-commands-view",
    treeProvider,
  );

  // 2. Command to Add Custom Command
  let addCustomCmdDisposable = vscode.commands.registerCommand(
    "expodeck.addCustomCommand",
    async () => {
      const label = await vscode.window.showInputBox({
        prompt: "Enter a title/label for your command",
        placeHolder: "e.g., Run Storybook",
      });
      if (!label) {
        return;
      }

      const commandText = await vscode.window.showInputBox({
        prompt: "Enter the full terminal command",
        placeHolder: "e.g., npx storybook",
      });
      if (!commandText) {
        return;
      }

      const descriptionText = await vscode.window.showInputBox({
        prompt: "Enter a short description",
        placeHolder: "e.g., Starts storybook UI",
      });
      if (!descriptionText) {
        return;
      }

      const newCmd: ExpoCommand = { label, commandText, descriptionText };

      const config = vscode.workspace.getConfiguration("expodeck");
      const existing: ExpoCommand[] =
        config.get<ExpoCommand[]>("customCommands") || [];

      existing.push(newCmd);

      await config.update(
        "customCommands",
        existing,
        vscode.ConfigurationTarget.Global,
      );

      treeProvider.refresh();
      vscode.window.showInformationMessage(`Custom command "${label}" added!`);
    },
  );

  // 3. Command to Delete Custom Command
  let deleteCustomCmdDisposable = vscode.commands.registerCommand(
    "expodeck.deleteCustomCommand",
    async (item: ExpoCommandItem) => {
      if (!item || !item.isCustom) {
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `Are you sure you want to delete "${item.expoCmd.label}"?`,
        { modal: true },
        "Delete",
      );

      if (confirm === "Delete") {
        const config = vscode.workspace.getConfiguration("expodeck");
        const existing: ExpoCommand[] =
          config.get<ExpoCommand[]>("customCommands") || [];

        const updated = existing.filter(
          (cmd) =>
            cmd.label !== item.expoCmd.label ||
            cmd.commandText !== item.expoCmd.commandText,
        );

        await config.update(
          "customCommands",
          updated,
          vscode.ConfigurationTarget.Global,
        );

        treeProvider.refresh();
        vscode.window.showInformationMessage(
          `Command "${item.expoCmd.label}" has been deleted.`,
        );
      }
    },
  );

  // 4. Command to Run in Terminal
  let runCmdDisposable = vscode.commands.registerCommand(
    "expodeck.runCommand",
    async (item: ExpoCommandItem | ExpoCommand) => {
      let commandText =
        item instanceof ExpoCommandItem
          ? item.expoCmd.commandText
          : item.commandText;

      if (commandText === "npx expo install ") {
        const pkg = await vscode.window.showInputBox({
          prompt: "Enter package name to install",
          placeHolder: "e.g., expo-image",
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

  // 5. Command to Copy to Clipboard
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

  // 6. Quick Pick Search Menu (Ctrl+Alt+E)
  let quickPickDisposable = vscode.commands.registerCommand(
    "expodeck.openQuickPick",
    async () => {
      const config = vscode.workspace.getConfiguration("expodeck");
      const customCommands: ExpoCommand[] =
        config.get<ExpoCommand[]>("customCommands") || [];
      const allCommands = [...EXPO_COMMANDS, ...customCommands];

      const quickPickItems = allCommands.map((cmd) => ({
        label: cmd.commandText,
        description: `${cmd.label} - ${cmd.descriptionText}`,
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
    addCustomCmdDisposable,
    deleteCustomCmdDisposable,
    runCmdDisposable,
    copyCmdDisposable,
    quickPickDisposable,
  );
}

export function deactivate() {}
