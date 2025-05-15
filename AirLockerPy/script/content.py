import pygame


def getCL():
    return {
        "BG": (228, 241, 255),
        "BGFocus": (212, 191, 255),
        "Tools": (26, 26, 26),
        "GRAY": (100, 100, 100),
        "WHITE": (255, 255, 255),
        "BLACK": (0, 0, 0),
        "RED": (255, 0, 0),
        "GREEN": (0, 255, 0),
        "BLUE": (0, 0, 255)
    }


def getIMG():
    return {
        "Lukoyanov": pygame.image.load('content/Lukoyanov.png'),
        "Email": pygame.image.load('content/Email.png'),
        "Password": pygame.image.load('content/Password.png'),
        "EDLogoBig": pygame.image.load('content/EDLogoBig.png'),
        "AirLockerIco": pygame.image.load('content/AirLockerIco.png'),
        "Molotok": pygame.image.load('content/Molotok.png'),
        "Back": pygame.image.load('content/Back.png'),
        "Reset": pygame.image.load('content/Reset.png'),
        "Next": pygame.image.load('content/Next.png'),
        "Return": pygame.image.load('content/Return.png'),
        "Home": pygame.image.load('content/Home.png'),
        "Entry": pygame.image.load('content/Entry.png'),
        "EntryFocused": pygame.image.load('content/EntryFocused.png'),
        "AITU": pygame.image.load('content/AITU.png'),
        "Locker": pygame.image.load('content/Locker.png'),
        "NewLocker": pygame.image.load('content/NewLocker.png'),
        "Locked": pygame.image.load('content/Locked.png'),
        "Unlocked": pygame.image.load('content/Unlocked.png'),
    }


def getSOUND():
    return {
        "Click": pygame.mixer.Sound('content/mixkit-click.wav'),
        "Error": pygame.mixer.Sound('content/mixkit-error.wav')
    }


def getFONT():
    return {
        "Main": pygame.font.Font('content/PixCyrillic.ttf', 16)
    }


def lang():
    return {
        "AL": "AirLocker",
        "Wait": "Please wait...",
        "PashaAITU": "Astana IT University\nLukoyanov Pavel\nSE-2331",
        "Welcome": "Welcome! Press any key to continue...",
        "EnterEmail": "Enter Email Address",
        "Email": "Email",
        "EnterPassword": "Enter Password",
        "Password": "Password",
        "SelectLocker": "Select Locker...",
    }
