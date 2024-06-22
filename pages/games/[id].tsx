import { useState, useEffect, useMemo } from 'react'
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

import customStyle from '../../src/utils/customStyle'
import { Loader, Spinner } from '@/src/components/UI';
import Layout from '@/src/components/Layout'

import { getPredictions, getAGameSet } from '@/src/queries/admin.queries';
import { TPredictionGroup, TPredictionSolo } from '@/src/types';
import { formatAmount } from '@/src/utils/common';

const Game = () => {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<'PENDING' | 'WON' | 'LOSE'>('PENDING');
    const [msisdn, setMsisdn] = useState('');
    const [subscriberId, setSubscriberId] = useState('');
    const [control, setControl] = useState(false);

    const { query, push } = useRouter();

    const styles = customStyle();

    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: "id", sort: "desc" }
    ]);

    const queryClient = useQueryClient();

    const payload = useMemo(() => {
        return {
            setId: String(query.id),
            msisdn,
            subscriberId,
            page
        }
    }, [msisdn, query.id, subscriberId, page])

    const { data, isLoading, isPreviousData, isFetching } = useQuery<TPredictionGroup>({
        queryKey: ['predictions', query.id, page + 1],
        queryFn: () => getPredictions(payload),
        keepPreviousData: true,
        staleTime: 5000,
        enabled: !!query.id
    })

    const { data: gameData, isLoading: gameIsLoading } = useQuery(['gameSet', query.id], () => getAGameSet(String(query.id)), {
        enabled: !!query.id
    })

    // Prefetch the next page!
    // useEffect(() => {
    //     if (!isPreviousData && (Number(data?.currentPage) < Number(data?.pages))) {
    //         queryClient.prefetchQuery({
    //             queryKey: ['predictions', query.id, page + 1],
    //             queryFn: () => getPredictions(payload),
    //         })
    //     }
    // }, [data, isPreviousData, page, queryClient, payload, query.id])

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Predictions",
            width: 180,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {
                            params?.row?.predictions.map((game: TPredictionSolo) => {
                                return (
                                    <div key={game.id} className="">
                                        <p className='text-green-korrect font-semibold text-sm text-center'>{game.home} : {game.away}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                )

            },
            flex: 1
        },
        {
            field: "dateAdded",
            headerName: "Booking Date",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy")}`,
            flex: 1
        },
        {
            field: "timestamp",
            headerName: "Time",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "hh:mm a")}`,
            flex: 1
        },
        {
            field: "status",
            headerName: "Status",
            type: "string",
            width: 100,
            renderCell(params) {
                return (
                    <div className='flex-center !justify-start h-full'>
                        <p className={`text-xs font-medium text-center ${params.row.status === 'WON' ? 'text-green' : params.row.status === 'PENDING' ? 'text-goldenrod' : 'text-red'}`}>{params.row.status} </p>
                    </div>
                )
            },
            flex: 1
        },
        {
            field: "userId",
            headerName: "User",
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex justify-center items-center gap-2 h-full w-full">
                        <button title='View User' onClick={() => handleViewUser(params.row)} className={`bg-transparent border-0 text-green-korrect outline-none px-2 py-1`}>
                            <Person2OutlinedIcon />
                        </button>
                    </div>
                );
            },
            flex: 1
        },
    ];

    const gameColumns: GridColDef[] = [
        {
            field: "league",
            headerName: "League",
            width: 130,
            headerAlign: "left",
            align: "left",
            renderCell(params) {
                return (
                    <div className='flex justify-start items-center h-full gap-2'>
                        <img src={params.row.league.logo} alt="league" className='w-8 h-8 rounded-full' />
                        <p className='hidden lg:block'>{params.row.league.name}</p>
                    </div>
                )
            },
            // flex: 0.7
        },
        // {
        //     field: "stadium",
        //     headerName: "Stadium",
        //     width: 150,
        //     headerAlign: "center",
        //     align: "center",
        // },
        {
            field: "round",
            headerName: "Round",
            width: 180,
            headerAlign: "left",
            align: "left",
        },
        {
            field: "home",
            headerName: "Home Team",
            width: 130,
            flex: 1,
            headerAlign: "left",
            renderCell(params) {
                return (
                    <div className='flex justify-start items-center h-full gap-4'>
                        <img src={params.row.home.logo} alt="league" className='w-8 h-8 rounded-full' />
                        <p>{params.row.home.name}</p>
                    </div>
                )
            },
        },
        {
            field: "results",
            headerName: "Scores",
            width: 80,
            flex: 1,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className='flex justify-center items-center h-full gap-4'>
                        <span className='text-green-korrect font-semibold text-sm'>{params.row.home.score}:{params.row.away.score}</span>
                    </div>
                )
            },
        },
        {
            field: "away",
            headerName: "Away Team",
            width: 70,
            flex: 1,
            headerAlign: "left",
            renderCell(params) {
                return (
                    <div className='flex justify-start items-center h-full gap-4'>
                        <p>{params.row.away.name}</p>
                        <img src={params.row.away.logo} alt="league" className='w-8 h-8 rounded-full' />
                    </div>
                )
            },
        },
        {
            field: "statusText",
            headerName: "Status",
            type: "string",
            width: 100,
            renderCell(params) {
                return (
                    <div className='flex-center !justify-start h-full'>
                        <p className={`text-xs text-left ${params.row.status === 'FT' ? 'text-green' : params.row.status === 'NS' ? 'text-goldenrod' : 'text-red'}`}>{params.row.statusText} </p>
                    </div>
                )
            },
            flex: 1
        },
        {
            field: "date",
            headerName: "Game Date",
            type: "string",
            width: 130,
            headerAlign: "left",
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy")}`,
            flex: 1
        },
        {
            field: "time",
            headerName: "Time",
            type: "string",
            width: 130,
            headerAlign: "left",
            flex: 1
        },
    ];


    const handleViewUser = (row: any) => {
        return push(`/users?userId=${row.userId}`)
    }

    const handlePageClick = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
    }

    if (isLoading || gameIsLoading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='w-full min-h-[90vh] pt-8'>
                <section className="w-full rounded-xl mb-8 bg-white p-6">
                    <h1 className='text-xl font-medium'>Game Set Info</h1>
                    {gameData?.expires && <div>
                        <p className='text-sm mt-4 text-green-korrect font-normal'>Expires: {format(new Date(gameData?.expires), "do MMM yyy, hh:mm a")}</p>
                    </div>}
                    <div className="border border-[#55565A] border-opacity-15 rounded-md mt-5">
                        <div className="overflow-auto">
                            <div className='w-full min-w-[65rem]'>
                                <DataGrid
                                    rows={gameData?.games ?? []}
                                    columns={gameColumns}
                                    // pageSize={20}
                                    className={styles.root}
                                    rowHeight={70}
                                    showCellVerticalBorder={false}
                                    showColumnVerticalBorder={false}
                                    columnHeaderHeight={55}
                                    sx={{ border: "0px", overflowX: "scroll" }}
                                    hideFooter={true}
                                    disableColumnMenu
                                    disableRowSelectionOnClick
                                    autoHeight
                                    sortModel={sortModel}
                                    onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl bg-white p-6">
                    <h2 className='text-xl font-medium'>Predictions</h2>

                    <div className="border border-[#55565A] border-opacity-15 rounded-md mt-5">
                        <div className="overflow-auto">
                            <div className='w-full min-w-[40rem]'>
                                <DataGrid
                                    rows={data?.predictions ?? []}
                                    columns={columns}
                                    // pageSize={20}
                                    className={styles.root}
                                    rowHeight={100}
                                    showCellVerticalBorder={false}
                                    showColumnVerticalBorder={false}
                                    columnHeaderHeight={55}
                                    sx={{ border: "0px", overflowX: "scroll" }}
                                    hideFooter={true}
                                    disableColumnMenu
                                    disableRowSelectionOnClick
                                    autoHeight
                                    sortModel={sortModel}
                                    onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                {isFetching && <section className="bg-white text-center py-2 px-6 rounded-xl mt-8">
                    <Spinner color='green-korrect' size={1.9} />
                </section>}
                <section className="paginate bg-white py-5 px-6 rounded-xl mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <div>
                        <p className='text-sm text-center'>{((Number(data?.currentPage) * Number(data?.pageSize)) + 1) - Number(data?.pageSize)} - {Number(data?.currentPage) * Number(data?.pageSize)} of {formatAmount(Number(data?.pages))} pages</p>
                    </div>
                    <div className='flex justify-center'>
                        <ReactPaginate
                            activeClassName={'!bg-[#07540A] !text-white'}
                            breakClassName={' break-me '}
                            breakLabel={'...'}
                            containerClassName={'flex justify-end items-center gap-2'}
                            disabledClassName={'disabled-page'}
                            marginPagesDisplayed={1}
                            nextClassName={"text-[#9C9898] text-xs"}
                            nextLabel="next"
                            onPageChange={handlePageClick}
                            pageCount={Number(data?.pages)}
                            pageClassName={'flex justify-center items-center py-2 px-4 text-sm bg-[#EDEDED] text-[#767171] rounded-md'}
                            pageRangeDisplayed={2}
                            previousClassName='text-[#9C9898] text-xs'
                            previousLabel="previous"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({
    req: { cookies }
}) => {
    if (!cookies.korrecto) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }

    return {
        props: {

        }
    };
};


export default Game