import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import { format } from "date-fns";
import ReactPaginate from 'react-paginate';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { Loader, Spinner, Modal } from '@/src/components/UI';
import Layout from '@/src/components/Layout'
import ScheduleGame from '@/src/components/ScheduleGame';
import EditGameset from '@/src/components/EditGameset';

import customStyle from '../../src/utils/customStyle'
import { getGameSets, getLeagues } from '@/src/queries/admin.queries';
import { TGameSetGroup, TGameSet, League, TGameSetSingle } from '@/src/types';
import { formatAmount } from '@/src/utils/common';

type Props = {
    leagues: League[];
}

const Games = ({ leagues }: Props) => {

    const [page, setPage] = useState(1);
    const [control, setControl] = useState(false);
    const [showEditGameset, setShowEditGameset] = useState(false);
    const [currentGameset, setCurrentGameset] = useState<TGameSet>();

    const styles = customStyle();

    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: "id", sort: "desc" }
    ]);

    const queryClient = useQueryClient();
    const { push } = useRouter();

    const { data, isLoading, isPreviousData, isFetching } = useQuery<TGameSetGroup>({
        queryKey: ['games', page],
        queryFn: () => getGameSets({ page, pageSize: 20 }),
        keepPreviousData: true,
        staleTime: 5000,
    })

    // Prefetch the next page!
    // useEffect(() => {
    //     if (!isPreviousData && (Number(data?.currentPage) < Number(data?.totalPages))) {
    //         queryClient.prefetchQuery({
    //             queryKey: ['games', page + 1],
    //             queryFn: () => getGameSets({ page: page + 1, pageSize: 20 }),
    //         })
    //     }
    // }, [data, isPreviousData, page, queryClient])

    const handleClick = (row: any) => {
        push(`/games/${row.id}`)
    }

    const handleEditClick = (row: any) => {
        setCurrentGameset(row);
        setShowEditGameset(true);
    }

    const columns: GridColDef[] = [
        {
            field: "games",
            headerName: "League",
            width: 130,
            flex: 1,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className='flex flex-col justify-center h-full gap-2'>
                        {params.row.games.map((game: TGameSetSingle) => {
                            return (
                                <div key={game.id} className="">
                                    <p className='text-xs text-center'>{game.league.name}</p>
                                </div>
                            )
                        })}
                    </div>
                )
            },
        },
        {
            field: "id",
            headerName: "Scheduled Games",
            width: 180,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {
                            params.row.games.map((game: TGameSetSingle) => {
                                return (
                                    <div key={game.id} className="">
                                        <p className='text-xs text-center'>{game.home.name} <span className='text-green-korrect font-semibold'>{game.home.score}:{game.away.score}</span> {game.away.name}</p>
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
            field: "addedBy",
            headerName: "Status",
            width: 180,
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex flex-col justify-center h-full gap-2">
                        {
                            params.row.games.map((game: TGameSetSingle) => {
                                return (
                                    <div key={game.id} className="">
                                        <p className={`text-xs text-center ${game.status === 'FT' ? 'text-green' : game.status === 'NS' ? 'text-goldenrod' : 'text-red'}`}>{game.statusText} </p>
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
            field: "gameDate",
            headerName: "Scheduled Date",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "do MMM, yyy")}`,
            flex: 1
        },
        {
            field: "expires",
            headerName: "Time",
            type: "string",
            width: 180,
            valueGetter: (params: any) => `${format(new Date(params), "hh:mm a")}`,
            flex: 1
        },
        {
            field: "expired",
            headerName: "Action",
            headerAlign: "center",
            renderCell(params) {
                return (
                    <div className="flex justify-center items-center gap-2 h-full w-full">
                        <button onClick={() => handleEditClick(params.row)} className={`bg-transparent border-0 text-blue outline-none px-2 py-1`}>
                            <EditOutlinedIcon />
                        </button>
                        <button onClick={() => handleClick(params.row)} className={`bg-transparent border-0 text-green outline-none px-2 py-1`}>
                            <VisibilityIcon />
                        </button>
                    </div>
                );
            },
            flex: 0.5
        },
    ];

    const handlePageClick = ({ selected }: { selected: number }) => {
        setPage(selected + 1);
    }

    if (isLoading) {
        return (
            <Layout>
                <Loader />
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='w-full min-h-[90vh] pt-8'>
                <section className="rounded-xl bg-white p-6">
                    <div className="flex justify-end items-center">
                        <button onClick={() => setControl(!control)} className='!bg-green-light !border-green-light text-white !rounded-md text-sm flex justify-end items-center'><AddOutlinedIcon /> <span>Schedule New Game</span></button>
                    </div>

                    <div className="border border-[#55565A] border-opacity-15 rounded-md mt-5">
                        <div className="overflow-auto">
                            <div>
                                <DataGrid
                                    rows={data?.gameSets ?? []}
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
                        <p className='text-sm text-center'>{data?.currentPage} - {Number(data?.currentPage) * Number(data?.pageSize)} of {formatAmount(Number(data?.totalPages))} pages</p>
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
                            pageCount={Number(data?.totalPages)}
                            pageClassName={'flex justify-center items-center py-2 px-4 text-sm bg-[#EDEDED] text-[#767171] rounded-md'}
                            pageRangeDisplayed={2}
                            previousClassName='text-[#9C9898] text-xs'
                            previousLabel="previous"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </section>

                <Modal
                    control={control}
                    close={setControl}
                >
                    <ScheduleGame leagues={leagues} setControl={setControl} />
                </Modal>

                <Modal
                    control={showEditGameset}
                    close={setShowEditGameset}
                >
                    {/*@ts-ignore */}
                    <EditGameset leagues={leagues} setControl={setShowEditGameset} currentGame={currentGameset} />
                </Modal>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req: { cookies } }) => {

    if (!cookies.korrecto) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        };
    }

    const data = await getLeagues();

    return {
        props: {
            leagues: data.data ?? [],
        }
    }
}

export default Games