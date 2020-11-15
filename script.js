const inputElement = document.querySelector('.input')
const outputElement = document.querySelector('.output')


function initEventListeners() {
  inputElement.addEventListener('keyup', event => {
      event.preventDefault()
      if (event.keyCode === 13) {
          evaluateInput();
      }
  });

  inputElement.addEventListener('blur', () => inputElement.focus())
  inputElement.focus()
}


function print(lines) {
  function write(line) {
    const newElement = document.createElement('p')
    newElement.setAttribute('class', 'command')
    newElement.innerHTML = line
    outputElement.appendChild(newElement)

    outputElement.scrollTop = outputElement.scrollHeight;
    console.log(line)
  }

  const currentline = lines.shift()
  write(currentline)
  if (lines.length > 0) {
    setTimeout(() => print(lines), 100);
  }
}


function getAndClearInput() {
  const value = inputElement.value
  inputElement.value = null
  print(['<strong>$</strong> ' + value])
  return value;
}

function clear() {
  outputElement.innerHTML = null;
}


function evaluateInput() {
  const input = getAndClearInput();
  const command = availableCommands()[input]

  function unavailable() {
    print(['command not found: ' + input, 'Enter <strong>help</strong> to list all available commands'])
  }

  if (input) {
    command ? command.run() : unavailable();
  }
}


function openLink(url) {
  print(['Opening ' + url, 'Please wait a moment...'])
  window.open(url,'_self')
}


function welcome() {
  print([
    'Starting session...',
    'Browser: ' + navigator.userAgent,
    'Date: ' + new Date().toISOString(),
    ' ',
    '<strong>Hi there</strong>, I\'m Torben.',
    'I do weird computer stuff.',
    'You can find me on the interwebs,',
    'enter <strong>help</strong> to learn more.'
  ])
}


function printHelp() {
  function getDescription(command) {
    return availableCommands()[command].description || null
  }

  const commands = Object.keys(availableCommands()).filter(getDescription)
  const maxCommandLength = Math.max(...(commands.map(c => c.length)))
  const commandHelpLines = commands.map(command => "<strong>" + command.padEnd(maxCommandLength, " ") + '</strong> -> ' + getDescription(command))

  const intro = ['Enter one of these commands to open my online profiles:']

  print(intro.concat(commandHelpLines))
}


function ls() {
  print([
    ".bash_history",
    ".id_rsa",
    "'Copy of Report Final (Version 2).doxc'",
    "'Extreme Tentacle Porn Volume XII.wmv'",
    'Desktop',
    'Downloads',
    "'how-to-become-rich-with-the-blockchain.pdf'",
    'Music',
    'node_modules',
    'Picures',
    'readme.md',
    'Work'
  ])
}

function exit() {
  clear(),
  print(['It is now safe to leave this site.'])
  document.querySelector('.input_wrapper').style.display = 'none';
}


function availableCommands() {
  return {
    github: {
      description: 'Unfinished side projects.',
      run: () => openLink('https://www.github.com/t0rbn')
    },
    twitter: {
      description: 'This is where I rant about stuff',
      run: () => openLink('https://www.twitter.com/t0rbn')
    },
    instagram: {
      description: 'Pictures of my food #yummy',
      run: () => openLink('https://www.instagram.com/torben_reetz/')
    },
    xing: {
      description: 'Doing serious business',
      run: () => openLink('https://www.xing.com/profile/Torben_Reetz2')
    },
    linkedin: {
      description: 'Doing serious *international* business',
      run: () => openLink('https://www.linkedin.com/in/torben-reetz-5151a513b/')
    },
    telegram: {
      description: 'Ping me!',
      run: () => openLink('https://www.telegram.me/t0rbn')
    },
    email: {
      description: 'Spam',
      run: () => openLink('mailto:hello@torben.xyz')
    },
    help: { run: () => printHelp() },
    clear: { run: () => clear() },
    welcome: { run: () => welcome() },
    ls: { run: () => ls() },
    exit: { run: () => exit() }
  }
}


initEventListeners()
welcome();
