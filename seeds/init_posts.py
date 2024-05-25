import requests
import secrets
import string

BASE_URL = ""
USERNAMES = [
    "princ3ss_l@yla",
    "p3nny",
    "sh3ph3rd",
    "b00z",
    "b0bby",
    "cl@irity",
    "m@cknch33zy"
]

def create_users(session):
    users = dict()
    for user in usernames:
        url = f'{BASE_URL}/register'
        data = {
            'username': user,
            'email': f'{user}@kindofanonymousemail.com',
            'password': string.ascii_uppercase + string.ascii_lowercase + string.digits + special_characters
        }

        users[user] = data["password"]

        requests.post(url=url, data=data, verify=False)

    return users


def create_comments(session, users):
    blabbit_ids = [
        
    ]

    reviews = [
        'Ourselves endeavor that chief more denoting. Collecting exposed debating know sake favour procured young pleased. Offered shewing engrossed daughters attention branched honoured folly material mean father spoil therefore scale with express',
        'Blush well country sympathize moreover gate pianoforte pleasure would merits ready. Elderly determine comparison.',
        'Engaged honoured coming conveying eldest hold hundred prevent admire period took find pursuit parish mirth.',
        'Left find travelling ready narrow wondered. Perfectly viewing effect temper attachment.',
        'Keeps dissuade exertion ladyship appearance made hand.',
        'Conveying it him added we delight outward. Delicate produced beauty several least quitting solid.',
        'That household genius. Fanny amiable assured pretended wonder written regret impossible are.',
        'Thoroughly snug preference invitation properly plenty hunted respect of preserved points fact large tolerably judgment.',
        'Taste visited four allow welcomed out therefore resolution husband dispatched smile replying moments expression ye. Distant share visit principles although out. ',
        'Contempt view summer contained laughter misery assistance margaret recommend sincerity settle esteem. Noisier request esteem about engrossed although solicitude along distrusts esteem',
        'Unfeeling missed ample denied applauded disposed justice surrounded offending cease natural other laughter received perhaps spring again.',
        'Size private five noise valley expect most suffer disposing explain are four occasional does snug. Folly dwelling fact admire sweetness who formed few guest longer simple evil what eagerness truth marriage.',
        'Partiality when meant. Highest studied ashamed led excited provision. Perpetual dare hundred nay middletons mind sir sociable compass while it.',
        'This thought distant noisy. Thoroughly affixed highly stuff lady call body.',
        'Feet addition vulgar prepared. Civility excellence graceful. Consisted perceived their remark venture goodness heard put nothing distrusts lively then',
        'Paid prospect stanhill whatever decisively simplicity built. Strangers just effects remember frankness feebly windows last trees body unpacked esteem pleased estimable',
        'Extended continued happiness because formal will children nature admire ladies. Would ﻿no both reserved tiled view exquisite chiefly.',
        'Adapted continual father therefore merits compliment easily sex yet books himself. Advantage vanity forbade own total convinced been ought. '
    ]

    host = ''
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    special_characters = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/"
    for user in users.keys():
        for blabbit_id in blabbit_ids:
            data = {
                'username': user,
                'password': users[user]
            }

            session.post(url=f'{host}/login', data=data, verify=False)

            rand_review = random.randint(0, (len(reviews) - 1))
            review = reviews[rand_review]
            data = f'review%5Brating%5D={random.randint(1, 5)}&review%5Bbody%5D={urllib.parse.quote(review)}'

            session.post(f'{host}/blabbits/{blabbit_id}/review', headers=headers, data=data, verify=False)

def main():
    session = requests.Session()

    users = create_users(session=session)
    create_comments(session=session, users=users)
    

if __name__ == "__main__":
    main()