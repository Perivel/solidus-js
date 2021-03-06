#!/usr/bin/env node

/*
BSD 2-Clause License

Copyright (c) 2022, Perivel LLC
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// This is the entrypoint of the SolidusJS CLI.
import { Process } from '@swindle/os';
import { runBuild } from './src/cli/commands/solidus-build';
import { runStart } from './src/cli/commands/solidus-start';
import { runDev } from './src/cli/commands/solidus-dev';
import { SolidusCommands } from './src/cli/utilities/solidus-commands.enum';
import container from './src/cli/utilities/container';
import { MessageFormatter } from './src/cli/utilities/message-formatter';

const runCli = async (): Promise<number> => {
   // determine which command to run.
   const [node, app, ...args] = Process.argv;
   const cmd = args[0];
   const fmt = container.get(MessageFormatter);

   if (cmd === SolidusCommands.build) {
      // run the build command.
      console.log('Building your application...');
      return await runBuild();
   }
   else if (cmd === SolidusCommands.dev) {
      // run the Dev command.
      return await runDev();
   }
   else if (cmd == SolidusCommands.start) {
      // run the app
      return await runStart();
   }
   else {
      // invalid command.
      console.log(fmt.message("Invalid Command"));
      return 0;
   }
}

runCli();