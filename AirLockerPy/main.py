import time

import requests

import script.content as cont
from script.tools import *
import pygame
import platform

from script.config_loader import ConfigLoader

CONFIG = ConfigLoader()

DEBUG = False
LAST_MOUSE_POSITION = (0, 0)
L_MOUSE_HOLD = False
R_MOUSE_HOLD = False
CTRL_HOLD = False
LOCATION = "INIT"

SPEEDS = ['1200', '2400', '4800', '9600', '19200', '38400', '57600', '115200']
PORTS = serial_ports()
real_port = None


def set_location(loc):
    global LOCATION
    LOCATION = loc


class Screens:
    def __init__(self, scr):
        self.scr = scr

    def loadscreen(self):
        scr = self.scr
        scr.blit(IMG['AITU'], align(IMG['AITU'], 14, 14, "lb"))
        scr.blit(IMG['Lukoyanov'], align(IMG['Lukoyanov'], 14, 10, "rb"))
        scr.blit(IMG['EDLogoBig'], align(IMG['EDLogoBig'], 0, -75, "ct"))
        multi_line(scr, FONT["Main"], 16, CL['BLACK'], LANG["PashaAITU"], 76, 17, "lb")

    def alert(self, img, header, info, bgcolor='BGFocus'):
        scr = self.scr

        ramka = pygame.Surface((240, 80), pygame.SRCALPHA)
        ramkaPos = align(ramka, 0, 0, "c")

        pygame.draw.rect(ramka, CL[bgcolor], pygame.Rect(0, 0, 240, 80), 0, 15)
        pygame.draw.rect(ramka, CL['BLACK'], pygame.Rect(0, 0, 240, 80), 1, 15)
        scr.blit(ramka, ramkaPos)

        scr.blit(img, align_relatively(ramkaPos, 8, 8))

        scr.blit(FONT["Main"].render(header, False, CL['BLACK']), align_relatively(ramkaPos, 47, 17))
        scr.blit(FONT["Main"].render(info, False, CL['BLACK']), align_relatively(ramkaPos, 8, 57))

    def header(self, name):
        scr = self.scr
        w, h = WIDTH - 20, 30

        ramka = pygame.Surface((w, h), pygame.SRCALPHA)
        pygame.draw.rect(ramka, CL['BGFocus'], pygame.Rect(0, 0, w, h), 0, 4)
        scr.blit(ramka, align(ramka, 0, 10, "ct"))

        name = FONT["Main"].render(name, False, CL['BLACK'])
        scr.blit(name, align(name, 0, 18, "ct"))

    def help(self, lst):  # [(ico, text), ...]
        scr = self.scr
        w, h = 300, (32 * len(lst)) + 16 + (8 * (len(lst) - 1))

        ramka = pygame.Surface((w, h), pygame.SRCALPHA)
        ramkaPos = align(ramka, 0, 10, "cb")
        pygame.draw.rect(ramka, CL['WHITE'], pygame.Rect(0, 0, w, h), 0, 15)
        pygame.draw.rect(ramka, CL['BLACK'], pygame.Rect(0, 0, w, h), 1, 15)
        scr.blit(ramka, ramkaPos)

        count = 0
        for g in lst:
            scr.blit(g[0], align_relatively(ramkaPos, 8, 8 + (32 * count) + (8 * count)))
            scr.blit(
                FONT["Main"].render(g[1], False, CL['BLACK']),
                align_relatively(ramkaPos, 47, 17 + (16 * count) + (24 * count))
            )
            count += 1

    def menu(self, ev, header, lst, focused, multiple):
        global L_MOUSE_HOLD
        scr = self.scr
        w, h = 360, 20 + (32 * len(lst)) + 16 + (8 * (len(lst) - 1))

        ramka = pygame.Surface((w, h), pygame.SRCALPHA)
        ramkaPos = align(ramka, 0, 0, "c")
        pygame.draw.rect(ramka, CL['WHITE'], pygame.Rect(0, 0, w, h), 0, 15)
        pygame.draw.rect(ramka, CL['BLACK'], pygame.Rect(0, 0, w, h), 1, 15)
        scr.blit(ramka, ramkaPos)

        scr.blit(FONT["Main"].render(header, False, CL['BLACK']), align_relatively(ramkaPos, 8, 8))

        count = 0
        for g in lst:
            o = IMG['Entry']
            if focused[count] == 1:
                o = IMG['EntryFocused']

            entry_pos = align_relatively(ramkaPos, 8, 28 + (32 * count) + (8 * count))
            scr.blit(o, entry_pos)

            mouse = LAST_MOUSE_POSITION
            entry_pos_corner = (entry_pos[0] + w - 10, entry_pos[1] + 32)
            if IN_check_2D(entry_pos, entry_pos_corner, mouse):
                scr.blit(IMG['EntryFocused'], entry_pos)

            if IN_check_2D(entry_pos, entry_pos_corner, mouse) and L_MOUSE_HOLD:
                if multiple:
                    focused[count] = not focused[count]
                else:
                    focused = list(map(lambda a: 0, focused))
                    focused[count] = 1
                SOUND['Click'].play()
                L_MOUSE_HOLD = False

            scr.blit(g[0], align_relatively(ramkaPos, 32, 28 + (32 * count) + (8 * count)))
            scr.blit(
                FONT["Main"].render(g[1], False, CL['BLACK']),
                align_relatively(ramkaPos, 71, 37 + (16 * count) + (24 * count))
            )
            count += 1

        return focused

    def loading(self):
        NOTIFICATIONS.append((IMG["Molotok"], "Please wait..."))
        self.help(NOTIFICATIONS)
        pygame.display.flip()

pygame.init()
pygame.mixer.init()

WIDTH, HEIGHT, FPS = 980, 780, 60
LAYOUT_HW_UPDATE(HEIGHT, WIDTH)
CL = cont.getCL()
IMG = cont.getIMG()
SOUND = cont.getSOUND()
FONT = cont.getFONT()
LANG = cont.lang()

screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
screens = Screens(screen)

pygame.display.set_caption(LANG['AL'])
pygame.display.set_icon(pygame.image.load('content/EDIco.png'))
clock = pygame.time.Clock()

NOTIFICATIONS = []

LOGIN_LOCATION = "email"
LOGIN_CREDS = ["", ""]

LOCKER_INPUT = ""

running = True
while running:
    clock.tick(FPS)
    screen.fill(CL['BG'])
    ev = pygame.event.get()

    for event in ev:
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.VIDEORESIZE:
            WIDTH = screen.get_width()
            HEIGHT = screen.get_height()
            LAYOUT_HW_UPDATE(HEIGHT, WIDTH)

        if event.type == pygame.MOUSEMOTION:
            LAST_MOUSE_POSITION = event.pos

        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:
                L_MOUSE_HOLD = True
            elif event.button == 3:
                R_MOUSE_HOLD = True

        if event.type == pygame.MOUSEBUTTONUP:
            if event.button == 1:
                L_MOUSE_HOLD = False
            elif event.button == 3:
                R_MOUSE_HOLD = False

        if event.type == pygame.KEYDOWN:
            if (
                    ((event.key == pygame.K_LCTRL or event.key == pygame.K_RCTRL) and platform.system() != "Darwin")
                    or (event.key == 1073742051 or event.key == 1073742055)
            ):
                CTRL_HOLD = True

        if event.type == pygame.KEYUP:
            if (
                    ((event.key == pygame.K_LCTRL or event.key == pygame.K_RCTRL) and platform.system() != "Darwin")
                    or (event.key == 1073742051 or event.key == 1073742055)
            ):
                CTRL_HOLD = False

    if LOCATION == "INIT":
        screens.loadscreen()

        if CONFIG.get_settings()["token"]:
            screens.loading()
            headers = {
                "Authorization": CONFIG.get_settings()["token"]
            }
            response = requests.get(f"{CONFIG.get_settings()["api"]}/user", headers=headers)
            NOTIFICATIONS = NOTIFICATIONS[:-1]

            if response.status_code == 200:
                print('Ответ:', response.json())
                CONFIG.set_setting("email", response.json()["email"])
                CONFIG.set_setting("username", response.json()["username"])
                CONFIG.set_setting("lockers", response.json()["lockers"])

                if CONFIG.get_settings()["lockerId"]:
                    LOCATION = "LOCKER"
                else:
                    LOCATION = "LOCKER_SELECTION"

            else:
                print(f'Ошибка: {response.status_code}')
                LOCATION = "LOGIN"
                NOTIFICATIONS.append((IMG["Next"], "You have to log in to continue."))
        else:
            LOCATION = "LOGIN"
            NOTIFICATIONS.append((IMG["Next"], "You have to log in to continue."))

    if LOCATION == "LOGIN":
        if LOGIN_LOCATION == "email":
            creds_index = 0
            img = IMG['Email']
            title = LANG['EnterEmail']
            subtitle = LANG['Email']
        else:
            creds_index = 1
            img = IMG['HEXIco']
            title = LANG['EnterPassword']
            subtitle = LANG['Password']

        for event in ev:
            if event.type == pygame.TEXTINPUT:
                LOGIN_CREDS[creds_index] += f"{event.text}"

            if event.type == pygame.KEYDOWN:
                if event.key == 8:
                    LOGIN_CREDS[creds_index] = LOGIN_CREDS[creds_index][:-1]

                if event.key == 13:
                    if LOGIN_LOCATION == "email":
                        LOGIN_LOCATION = "password"
                    else:
                        screens.loading()

                        data = {
                            "email": LOGIN_CREDS[0],
                            "password": LOGIN_CREDS[1]
                        }
                        response = requests.post(f"{CONFIG.get_settings()["api"]}/login", json=data)
                        NOTIFICATIONS = NOTIFICATIONS[:-1]

                        if response.status_code == 200:
                            print('Ответ:', response.json()['token'])
                            CONFIG.set_setting("token", response.json()['token'])
                            LOCATION = "INIT"
                            NOTIFICATIONS = []
                        else:
                            print(f'Ошибка: {response.status_code}')
                            LOGIN_LOCATION = "email"
                            NOTIFICATIONS.append((IMG["Reset"], "Incorrect email/password"))

                if event.key == 27:
                    LOGIN_LOCATION = "email"

        screens.alert(img, title, f"{subtitle}: {LOGIN_CREDS[creds_index] + '_'}", "WHITE")

    if LOCATION == "LOCKER":
        if CONFIG.get_settings()["port"]:
            headers = {
                "Authorization": CONFIG.get_settings()["token"]
            }
            response = requests.get(f"{CONFIG.get_settings()["api"]}/locker/{CONFIG.get_settings()["lockerId"]}", headers=headers)

            if response.status_code == 200:
                screens.alert(IMG['EDIcoGUI'], f"{response.json()["lockerName"]}", f"{response.json()["isLocked"]}", "BGFocus")

            else:
                print(f'Ошибка: {response.status_code}')
                CONFIG.set_setting("lockerId", "")
                LOCATION = "INIT"

            pygame.display.flip()
            time.sleep(3)

        else:
            LOCATION = "PORT_SELECTION"

    if LOCATION == "LOCKER_SELECTION":
        lockers = CONFIG.get_settings()["lockers"]

        lockers_gui = []
        for locker in lockers:
            lockers_gui.append((IMG["Home"], locker["lockerName"]))

        lockers_gui.append((IMG["Molotok"], "New Locker"))

        menu = screens.menu(ev, LANG["SelectLocker"], lockers_gui, [0] * len(lockers_gui), False)

        if 1 in menu:
            if menu.index(1) != len(menu) - 1:
                lockerId = lockers[menu.index(1)]["_id"]
                CONFIG.set_setting("lockerId", lockerId)
                LOCATION = "LOCKER"
            else:
                LOCATION = "NEW_LOCKER"

    if LOCATION == "NEW_LOCKER":
        for event in ev:
            if event.type == pygame.TEXTINPUT:
                LOCKER_INPUT += f"{event.text}"

            if event.type == pygame.KEYDOWN:
                if event.key == 8:
                    LOCKER_INPUT = LOCKER_INPUT[:-1]

                if event.key == 13:
                    screens.loading()
                    data = {
                        "password": "",
                        "lockerName": LOCKER_INPUT
                    }
                    headers = {
                        "Authorization": CONFIG.get_settings()["token"]
                    }
                    response = requests.post(f"{CONFIG.get_settings()["api"]}/locker", json=data, headers=headers)
                    NOTIFICATIONS = NOTIFICATIONS[:-1]

                    if response.status_code == 200:
                        print('Ответ:', response.json())
                        CONFIG.set_setting("lockerId", response.json()["lockerId"])
                        LOCATION = "LOCKER"
                    else:
                        print(f'Ошибка: {response.status_code}')

                if event.key == 27:
                    LOGIN_LOCATION = "email"

        screens.alert(IMG["Molotok"], "New Locker", f"Locker Name: {LOCKER_INPUT + '_'}", "WHITE")

    if LOCATION == "PORT_SELECTION":
        screens.loadscreen()
        #screens.alert(IMG['EDIcoGUI'], LANG['AL'], f"{LANG['Wait']} -", "BGFocus")

        ports_gui = []
        for i in PORTS:
            ports_gui.append((IMG["Molotok"], i))

        p = screens.menu(ev, "Select port", ports_gui, [0] * len(ports_gui), False)

        for event in ev:
            if event.type == pygame.KEYDOWN:
                if event.key == 13:
                    LOCATION = "LOGIN"

        if 1 in p:
            real_port = serial.Serial(PORTS[p.index(1)], 9600)
            CONFIG.set_setting("port", PORTS[p.index(1)])
            LOCATION = "LOCKER"

    if LOCATION == "TOOLS":
        actions = [
            lambda: real_port.write(b"0\n"),
            lambda: real_port.write(b"-2\n"),
            lambda: real_port.write(b"-1\n"),
            lambda: real_port.write(b"777\n"),
            lambda: set_location("START")
        ]

        p = screens.menu(ev, "TOOLS", [
            (IMG["Reset"], "RESET COUNTER"),
            (IMG["Next"], "Start"),
            (IMG["Next"], "Stop"),
            (IMG["HEXIco"], "Enter number"),
            (IMG["Reset"], "Return"),
        ], [0, 0, 0, 0, 0, 0], False)

        if 1 in p:
            actions[p.index(1)]()

    if NOTIFICATIONS:
        screens.help(NOTIFICATIONS)

    pygame.display.flip()

pygame.quit()
