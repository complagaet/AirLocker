import sys
import serial
import glob

HEIGHT, WIDTH = 0, 0


def LAYOUT_HW_UPDATE(h, w):
    global HEIGHT
    global WIDTH
    HEIGHT = h
    WIDTH = w


def align_relatively(anchor, x, y):
    return anchor[0] + x, anchor[1] + y


def align(surf, x, y, corner):
    ret = [0, 0]
    if corner == "ct":  # Center-Top
        ret[0] = WIDTH - (surf.get_width() / 2) - (WIDTH / 2) - x
        ret[1] = y

    if corner == "c":  # Center
        ret[0] = WIDTH - (surf.get_width() / 2) - (WIDTH / 2) - x
        ret[1] = HEIGHT - (surf.get_height() / 2) - (HEIGHT / 2) - y

    if corner == "rb":  # Right-Bottom
        ret[0] = WIDTH - surf.get_width() - x
        ret[1] = HEIGHT - surf.get_height() - y

    if corner == "rt":  # Right-Top
        ret[0] = WIDTH - surf.get_width() - x
        ret[1] = y

    if corner == "lc":  # Left-Bottom
        ret[0] = x
        ret[1] = HEIGHT - (surf.get_height() / 2) - (HEIGHT / 2) - y

    if corner == "cb":  # Center-Bottom
        ret[0] = WIDTH - (surf.get_width() / 2) - (WIDTH / 2) - x
        ret[1] = HEIGHT - surf.get_height() - y

    if corner == "lb":  # Left-Bottom
        ret[0] = x
        ret[1] = HEIGHT - surf.get_height() - y

    if corner == "lt":  # Left-Top
        ret[0] = x
        ret[1] = y

    return ret[0], ret[1]  # Returns tuple


def multi_line(scr, font, f_size, color, text, x, y, al):
    lines = reversed(text.splitlines())
    for i, l in enumerate(lines):
        g = font.render(l, False, color)
        scr.blit(g, align(g, x, y + f_size * i, al))


def IN_check_2D(left_top, right_bottom, pos):
    return left_top[0] <= pos[0] < right_bottom[0] and left_top[1] <= pos[1] < right_bottom[1]


def serial_ports():
    """ Lists serial port names

        :raises EnvironmentError:
            On unsupported or unknown platforms
        :returns:
            A list of the serial ports available on the system
    """
    if sys.platform.startswith('win'):
        ports = ['COM%s' % (i + 1) for i in range(256)]
    elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
        # this excludes your current terminal "/dev/tty"
        ports = glob.glob('/dev/tty[A-Za-z]*')
    elif sys.platform.startswith('darwin'):
        ports = glob.glob('/dev/tty.*')
    else:
        raise EnvironmentError('Unsupported platform')

    result = []
    for port in ports:
        try:
            s = serial.Serial(port)
            s.close()
            result.append(port)
        except (OSError, serial.SerialException):
            pass
    return result
