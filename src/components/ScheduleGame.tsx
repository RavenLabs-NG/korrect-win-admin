import { useEffect, useState } from 'react'
import Datetime from "react-datetime"
import { useMutation, useQueryClient } from 'react-query';
import { Moment } from 'moment';
import { toast } from 'react-toastify';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { add, sub } from 'date-fns';

import { Input, Dropdown, Spinner } from './UI';
import { League, TFixture } from '../types';
import { getFixtures, createGameSets } from '../queries/admin.queries';

type TFixtureAlt = {
    home: string,
    away: string,
    id: string
}

type Props = {
    leagues: League[],
    setControl: (v: boolean) => void;
}

const ScheduleGame = ({ leagues, setControl }: Props) => {

    const queryClient = useQueryClient();

    const [leaguesList, setLeaguesList] = useState<any>();
    const [league, setLeague] = useState<number>();

    const [fixturesList, setFixturesList] = useState<any>();
    const [fixture, setFixture] = useState<number>();
    const [fixturesToUpload, setFixturesToUpload] = useState<TFixtureAlt[]>([]);

    const [selectedArea, setSelectedArea] = useState<TFixtureAlt[]>([]);

    const [startDate, setStartDate] = useState('')

    const mutation = useMutation(getFixtures);
    const createMutation = useMutation(createGameSets);

    useEffect(() => {
        if (leagues) {
            const formattedLeague = leagues.map((league: League) => {
                return {
                    label: league.name,
                    value: league.name,
                    img: league.logo,
                    id: league.providerId
                }
            });

            setLeaguesList(formattedLeague);
        }
    }, [leagues]);

    const validBookingDate = (current: { isAfter: (n: Date) => void, isBefore: (n: Date) => void }) => {
        return current.isAfter(sub(new Date(), { days: 1 }));
    }

    const onDateChange = (e: Moment | string) => {
        //@ts-ignore
        setStartDate(add(new Date(e.format()), { days: 1 }).toISOString().substring(0, 10))
    }

    const handleFetchFixtures = (e: any) => {
        setLeague(Number(e.id));
        setFixturesList([]);

        if (startDate) {
            const payload = {
                startDate,
                league: e.id
            }

            mutation.mutate(payload, {
                onSuccess: (data) => {
                    if (data.status) {
                        if (data?.data?.fixtures.length === 0) {
                            toast.error(data.message);
                            return;
                        }
                        
                        const fixtures = data.data.fixtures.map((item: TFixture) => {
                            return {
                                home: item.home.name,
                                away: item.away.name,
                                id: item.thirdPartyId
                            }
                        })
                        setFixturesList(fixtures)
                    }
                }
            })
        }
    }

    const handleGameSelect = (fixture: TFixtureAlt) => {
        if (selectedArea.find((item) => item.id === fixture.id)) {
            let newArr = selectedArea.filter(item => item.id !== fixture.id);
            setSelectedArea(newArr);
        } else {
            if (selectedArea.length >= 3 || (selectedArea.length + fixturesToUpload.length) >= 3) {
                return toast.error('You can only select up to 3 games');
            }
            setSelectedArea(prev => [...prev, fixture]);
        }
    }

    const addGamestoPipeline = () => {
        setFixturesToUpload(prev => [...prev, ...selectedArea]);
        setSelectedArea([]);
        setFixturesList([]);
    }

    const handleRemoveFromPipeline = (fixture: TFixtureAlt) => {
        let newFixtures = fixturesToUpload.filter((item) => item.id !== fixture.id);
        setFixturesToUpload(newFixtures);
    }

    const handleCreateGameSet = () => {
        if(fixturesToUpload.length < 2) {
            return toast.info('Gamesets should be a minimum of 2');
        }

        if(fixturesToUpload.length > 3) {
            return toast.error('Gamesets should not exceed 3 games');
        }

        const payload = {
            date: startDate,
            status: true,
            fixtures: fixturesToUpload.map((fixture) => fixture.id)
        }

        createMutation.mutate(payload, {
            onSuccess: (data) => {
                if(data.status) {
                    toast.success(data.message);
                    queryClient.invalidateQueries(['games', 1]);
                    setSelectedArea([]);
                    setFixturesList([]);
                    setFixturesToUpload([]);
                    setControl(false);
                } else {
                    toast.error(data.message);
                    setControl(false);
                }
                
            },
            onError: (err) => {
                if(typeof err === 'string') {
                    toast.error(err);
                } else {
                    toast.error('Error creating gameset');
                }
            }
        })
    }

    //TODO Find a way to prevent games that have been added to pipeline from displaying as options

    return (
        <div className='bg-white p-6 rounded-lg w-full'>
            <h2 className='font-semibold md:text-2xl'>Schedule New Game</h2>
            <div className="mt-6">
                <Datetime
                    closeOnSelect
                    timeFormat={false}
                    className="text-black cursor-pointer"
                    //@ts-ignore
                    isValidDate={validBookingDate}
                    dateFormat="DD-MM-YYYY"
                    onChange={onDateChange}
                    renderInput={(props, open) => {
                        return (
                            <Input
                                {...{ ...props }}
                                // @ts-ignore
                                onChange={e => {
                                    props.onChange(e);
                                }}
                                placeholder='Schedule Date'
                                onClick={open}
                                // label="Date"
                                activeInput={!!props.value}
                                TrailingIcon={() => (
                                    // @ts-ignore
                                    <span className="relative" onClick={open}>
                                        <CalendarMonthOutlinedIcon />
                                    </span>
                                )}
                            />
                        );
                    }}
                />
            </div>
            <div className='mt-4'>
                <Dropdown
                    data={leaguesList}
                    placeholder='Choose League'
                    searchable
                    //@ts-ignore
                    onChange={(e) => handleFetchFixtures(e)}
                />
            </div>
            {mutation.isLoading && <div className='flex my-12 justify-center items-center gap-2'>
                <Spinner size={1.7} color='green' />
                <p className='text-xs'>Fetching fixtures</p>
            </div>}
            {fixturesList && <div className='w-full mt-8'>
                <div className='flex justify-start items-center flex-wrap gap-4'>
                    {fixturesList.map((fixture: any, i: number) => (
                        <div key={i} onClick={() => handleGameSelect(fixture)}
                            className={`${selectedArea.includes(fixture) && "bg-green text-white border-green"} border border-black-light cursor-pointer rounded-full px-5 py-3 text-xs`}>
                            {fixture.home} : {fixture.away}
                        </div>
                    ))}
                </div>
                {selectedArea.length > 0 && <div className='mt-4 flex justify-end'>
                    <button onClick={addGamestoPipeline} className=' bg-[#061537] text-white px-5 py-3 text-xs rounded-md'>Add {selectedArea.length} to set</button>
                </div>}

            </div>}
            {fixturesToUpload.length > 0 &&
                <div className='w-full mt-4'>
                    <h3 className='font-medium mb-3'>Games to upload</h3>
                    <div className='flex flex-col gap-3 items-start'>
                        {fixturesToUpload.map((fixture, i) => (
                            <div key={fixture.id} className='px-6 py-2 text-xs border border-[#CDCACA] rounded-full text-grey-main font-medium flex justify-start items-center gap-3'>
                                <span>No {i + 1} selection</span>
                                <span>:</span>
                                <span>{fixture.home} : {fixture.away}</span>
                                <span className='cursor-pointer' onClick={() => handleRemoveFromPipeline(fixture)}><CancelOutlinedIcon /></span>
                            </div>
                        ))}
                    </div>
                </div>
            }
            <div className="flex justify-end items-center gap-3 mt-16">
                <button disabled={createMutation.isLoading} onClick={() => setControl(false)} className='border border-green text-green px-5 py-3 text-xs rounded-md'>{createMutation.isLoading ? <Spinner size={1.7} /> : 'Close'}</button>
                <button disabled={createMutation.isLoading} onClick={handleCreateGameSet} className='bg-green text-white px-5 py-3 text-xs rounded-md'>{createMutation.isLoading ? <Spinner size={1.7} /> : 'Submit'}</button>
            </div>
        </div>
    )
}

export default ScheduleGame