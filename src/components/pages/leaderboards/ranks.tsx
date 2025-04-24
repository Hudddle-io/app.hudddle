import React from 'react';
import { Clock4, Star } from 'lucide-react';
import Image from 'next/image';


type User = {
    rank: number;
    stars: number;
    image: string;
    time: string;
};

type RanksProps = {
    users: User[];
};

const Ranks: React.FC<RanksProps> = ({ users }) => {
    const getBackgroundImage = (rank: number): string => {
        switch (rank) {
            case 1:
                return "/assets/frame1.svg";
            case 2:
                return "/assets/frame2.svg";
            case 3:
                return "/assets/frame3.svg";
            default:
                return "/assets/frame1.svg";
        }
    };


    return (
        <section className="grid grid-cols-3 mt-24 items-center justify-between gap-14">
            {users.map((user, i) => (
                <div
                    key={i}
                    className={`${i === 1 ? 'h-[250px]' : 'h-[220px]'} rounded-lg relative`}
                    style={{
                        backgroundImage: `url(${getBackgroundImage(user.rank)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <Image
                        src={user.image}
                        alt={`rank${user.rank}`}
                        width={120}
                        height={120}
                        className='object-cover object-center rounded-full border-2 border-white absolute -top-14 left-1/2 -translate-x-1/2'
                        loading='lazy'
                    />
                    <div className='mt-24'>
                        <p className='text-white text-xs text-center'>Average work quality</p>
                        <div className='mx-auto flex items-center justify-center gap-1 mt-1'>
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                    key={j}
                                    size={18}
                                    color={j < user.stars ? "#EEAE05" : "#FFFFFF"}
                                    fill={j < user.stars ? "#EEAE05" : "#FFFFFF"}
                                />
                            ))}
                        </div>
                        <p className='text-white text-xs text-center pt-5'>Total hours today</p>
                        <div className='flex items-center justify-center font-bold text-white gap-1 mt-1'><Clock4 size={18} /> <h1 className='tracking-wide'>{user.time}</h1></div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default Ranks;
