import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRoleProjectRequest, getRoleProjectReset } from "../../../../redux/slice/user-management-slice/GetRoleProjectSlice";
import { getRoleAppRequest, getRoleAppReset } from "../../../../redux/slice/user-management-slice/GetRoleAppSlice";
import { getRoleWorkloadRequest, getRoleWorkloadReset } from "../../../../redux/slice/user-management-slice/GetRoleWorkloadSlice";
import "../../../../styles/user-management-styles/EditeIndex.css";
import { getRoleAccessRequest, getRoleAccessReset } from "../../../../redux/slice/user-management-slice/GetRoleAccessSlice";
import { getRoleRequest, getRoleReset } from "../../../../redux/slice/user-management-slice/GetRoleSlice";
import {
  Project,
  Application,
  Workload,
  RoleName
} from "../../../../redux/@types/user-management-types/RoleMappingTypes";
import { getQueryParam } from "../../../../helper/SearchParams";
import { CustomBackdrop } from "../../../../helper/backDrop";
import MySnackbar from "../../../../helper/SnackBar";
import ArrowRightIcon from "../../../../assets/icons/ArrowRightIcon";
import FileFolderIcon from "../../../../assets/icons/FileFolderIcon";
import FrameIcon from "../../../../assets/icons/FrameIcon";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const RoleMappingContactApiProvider = ({
  userId,
  action,
  unMappedUserId,
  handleUserSelect,
  overViewAccess,
}: {
  userId?: string;
  action?: string;
  unMappedUserId?: string;
  handleUserSelect?: (isSubmited: boolean) => boolean;
  overViewAccess?: boolean;
}) => {
  const navigate = useNavigate()
  const checkBoxStyle = {
    '& .MuiSvgIcon-root': {
      fontSize: 20,
    },
    '&.MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#F46662',
      position: 'relative',
      left: '0px',
    },
    '&.MuiCheckbox-colorPrimary': {
      color: '#fff',
      position: 'relative',
      left: '-4px',
    },
    '&.Mui-disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      'pointer-events': 'auto',
    },
  };
  const dispatch = useDispatch();
  const [isProjectArrowDown, setIsProjectArrowDown] = useState<boolean>(false);
  const [isApplicationArrowDown, setIsApplicationArrowDown] = useState<boolean>(false);
  const [checkedData, setCheckedData] = useState<{
    user_id: string,
    projectdtl: any[],
  }>({
    user_id: '',
    projectdtl: []
  });
  const [storeSelectedProject, setStoreSelectedProject] = useState<{
    roleMap: Map<string, string>;
    roleName: string;
  }>({
    roleMap: new Map<string, string>(),
    roleName: '',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [updateRemovedProject, setUpdateRemovedProject] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [directWorkload, setDirectWorkload] = useState<{
    directWorkload: any[],
  }>({
    directWorkload: [],
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<any | null>(null);
  const { projectData, loading: projectLoading } = useSelector((state: any) => state.getRoleProject);
  const { appData, loading: appLoading } = useSelector((state: any) => state.getRoleApp);
  const { workloadData, loading: workloadLoading } = useSelector((state: any) => state.getRoleWorkload);
  const { role, loading: roleLoading } = useSelector((state: any) => state.getRole);
  const { success: successroleaccess, error: errorroleaccess, loading: getroleaccess } = useSelector((state: any) => state.getRoleAccess);
  const [expandedProject, setExpandedProject] = useState<any | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<any | null>(null);
  const [finalResult, setFinalResult] = useState<{
    user_id: string,
    projectdtl: any[],
  }>({
    user_id: '',
    projectdtl: []
  })
  const user_id = userId ?? getQueryParam('id');
  const project_id = getQueryParam('projectId');



  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  //** Initially clear status */ 
  useEffect(() => {
    setProjects([]);
    setApplications([]);
    setWorkloads([]);
    setDirectWorkload({
      directWorkload: [],
    });
    setSelectedProject(null);
    setSelectedApplication(null);
    setExpandedProject(null);
    setExpandedApplication(null);
    setFinalResult({
      user_id: '',
      projectdtl: []
    });
    return () => {
      dispatch(getRoleProjectReset());
      dispatch(getRoleAppReset());
      dispatch(getRoleWorkloadReset());
      dispatch(getRoleReset());
      dispatch(getRoleAccessReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (successroleaccess) {
      setMessage(successroleaccess.data);
      setSeverity("success");
      setOpen(true);
      if (userId && project_id && handleUserSelect) {
        setTimeout(() => handleUserSelect(true), 1000);
      } else {
        setTimeout(() => navigate(`/overview/settings?tab=1`), 1000);
      }
    } else if (errorroleaccess) {
      setMessage(errorroleaccess);
      setSeverity("error");
      setOpen(true);
    }
    return () => {
      dispatch(getRoleAccessReset())
    };
  }, [
    successroleaccess, errorroleaccess,
    dispatch, navigate,
    userId, project_id,
    handleUserSelect]);

  const handleSnackbarClose = () => setOpen(false)

  //** 1. feaching data from api for Project list */ 
  //** 2. feaching data from api for Role list */ 
  useEffect(() => {
    const bodyCodition: any = {
      queryparams: `userproject=true`
    };

    if (project_id && !overViewAccess) {
      bodyCodition.queryparams += `&project_id=${project_id}`
    }

    if (overViewAccess) {
      bodyCodition.queryparams += `&mappedproject&mappedproject=true`;
    } else {
      bodyCodition.queryparams += `&_id=${user_id}`
    }

    dispatch(getRoleProjectRequest(bodyCodition));
    dispatch(getRoleRequest());
  }, [dispatch, project_id, user_id, overViewAccess]);

  //** setting feached data from api for Project list*/
  useEffect(() => {
    if (projectData?.data?.projectDtl && projectData?.data?.projectDtl?.length > 0) {
      const updatedProjects = projectData?.data?.projectDtl.map((item: any) => {
        if (item.hasOwnProperty('roledtl')) {
          return {
            ...item,
            project_name: item.project_name ?? item.project.name,
            isActive: true,
            role_name: item.roledtl.role_name,
            role_id: item.roledtl._id,
          };
        } else {
          return item;
        }
      });
      setProjects(updatedProjects);
    }
  }, [projectData?.data?.projectDtl]);

  //** When ever the checkbox is clicked based Workload_Admin directly */
  useEffect(() => {
    if (workloads.length > 0 && selectedApplication?.isActive) {
      const roleMap = new Map<string, string>(role?.map(({ role_name, _id }: { role_name: string, _id: string }) => [role_name, _id]));
      const application = applications?.find((application) => (
        application.project_id === selectedApplication?.project_id &&
        application.isActive
      ));
      if (application) {
        const project = projects?.find((product) => product._id === selectedProject?._id);
        const filteredApplications = applications.filter((appDtl) => {
          return (
            appDtl.project_id === application.project_id &&
            appDtl.isActive
          );
        });
        const appdtl = filteredApplications.map((appDtl) => {
          const relatedWorkloads = workloads.filter((workDtl) => (
            (workDtl.app_id === appDtl._id && workDtl?.isActive) ||
            (workDtl.app_id === appDtl._id && workDtl?.isupdatechecked && workDtl?.isActive === undefined)
          ));
        
          const hasActiveWorkload = relatedWorkloads.some((workDtl) => workDtl.isActive);
        
          const mappedWorkloads = relatedWorkloads.map((workDtl) => ({
            workload_id: workDtl._id,
            role_id: roleMap.get(RoleName.WORKLOAD_ADMIN),
            role_name: RoleName.WORKLOAD_ADMIN,
            isActive: workDtl.isActive ?? false,
            application_id: appDtl._id,
          }));
        
          return {
            application_id: appDtl._id,
            isActive: hasActiveWorkload,
            workloaddtl: mappedWorkloads,
          };
        });
        

        // let isWorkloadSelected: boolean = false;

        // appdtl.forEach(({ workloaddtl }) => {
        //   isWorkloadSelected = workloaddtl.some(({ isActive }) => isActive === true);
        // });

        const fromDirectWorkload: Record<string, any> = {
          project_id: application.project_id,
          role_id: project?.role_name === RoleName.INFRA_ADMIN && project.isActive ? undefined : roleMap.get(RoleName.WORKLOAD_ADMIN),
          role_name: project?.role_name === RoleName.INFRA_ADMIN && project.isActive ? RoleName.INFRA_ADMIN : RoleName.WORKLOAD_ADMIN,
          // isActive: ((isWorkloadSelected) || (project?.role_name === RoleName.INFRA_ADMIN && project.isActive)) ? true : false,
          isActive: true,
          appdtl: appdtl
        }

        if (_.isNil(fromDirectWorkload.role_id)) {
          fromDirectWorkload['infra_role_id'] =  roleMap.get(RoleName.INFRA_ADMIN)
        }

        if (appdtl.length > 0) {
          setDirectWorkload((preCheckData) => { 
            const filteredDirectWorkload = preCheckData.directWorkload.filter((item) => (
              item.project_id !== application.project_id &&
              item.application_id !== application._id
            ));
            return {
              directWorkload: [...filteredDirectWorkload, fromDirectWorkload],
            }
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workloads, selectedApplication, applications, role, selectedProject?._id, projects]);

  // ** checkedData for every type (Eg: 'Project_Admin', 'Infra_Admin', 'View_Only', 'Workload_Admin' )
  useEffect(() => {
    let formedAllProjectData: {
      user_id: string,
      projectdtl: any[],
    } = {
      user_id: '',
      projectdtl: [],
    };

    let formedAllDirectWorkload: any[] = []

    if (checkedData?.user_id !== '' &&
      checkedData?.projectdtl?.length > 0) {
      formedAllProjectData = checkedData;
    }

    if (directWorkload?.directWorkload?.length > 0) {
      formedAllDirectWorkload = directWorkload?.directWorkload?.filter(obj =>
        obj.appdtl.some((app: { workloaddtl: string | any[]; }) => app.workloaddtl.length > 0));
    }

    const finalobj = formedAllDirectWorkload.filter((obj1) => {
      const matchingObj = formedAllProjectData.projectdtl.find((obj2) => obj1.project_id === obj2.project_id);
      return !matchingObj;
    });

    setFinalResult({
      user_id: user_id ?? '',
      projectdtl: [...formedAllProjectData.projectdtl, ...finalobj],
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedData, directWorkload, user_id]);

  //** validCheckedState is use to check evey time the checkbox is clicked and form the result */
  const validCheckedState = useCallback(({ roleName }: { roleName: string }) => {
    const updateRemovedProject: any[] = projectData?.data?.projectDtl
    .filter((item: Record<string, any>) => {
      const project = projects.find((project: Record<string, any>) => (
        project._id === item.project_id && project?.roledtl?.role_name !== RoleName.WORKLOAD_ADMIN
      ));
      return project && ((project.role_name !== item?.roledtl?.role_name) || !project.isActive);
    })
    .map((item: Record<string, any>) => ({
      appdtl: [],
      isActive: false,
      project_id: item.project_id,
      role_id: item?.roledtl?._id,
      role_name: item?.roledtl?.role_name,
    }));

    setUpdateRemovedProject(updateRemovedProject);

    // ** Update scenario to find the check project */
    const isUpdatedProduct = projectData?.data?.projectDtl.find(
      (item: Record<string, any>) => (
        item._id === selectedProject?._id && item.hasOwnProperty('roledtl') &&
        (selectedProject?.role_name ?? roleName) === item?.roledtl?.role_name
      ));

    const project = projects?.find((product) => product._id === selectedProject?._id);

    const roleMap = new Map<string, string>(role?.map(({ role_name, _id }: { role_name: string, _id: string }) => [role_name, _id]));

    if (project && project.isActive && !isUpdatedProduct) {
      const filteredApplications = applications.filter((appDtl) => {
        const activeWorkloads = workloads.filter((workDtl) => (
          workDtl.app_id === appDtl._id && workDtl.isActive
        ));
        return (
          appDtl.project_id === project._id &&
          appDtl.isActive &&
          activeWorkloads.length > 0
        );
      });

      const appdtl = (project.role_name ?? roleMap) === RoleName.INFRA_ADMIN ? filteredApplications.map((appDtl) => ({
        application_id: appDtl._id,
        isActive: appDtl.isActive,
        workloaddtl: workloads
          .filter((workDtl) => (
            workDtl.app_id === appDtl._id && workDtl.isActive
          ))
          .map((workDtl) => ({
            workload_id: workDtl._id,
            role_id: roleMap.get(RoleName.WORKLOAD_ADMIN),
            role_name: RoleName.WORKLOAD_ADMIN,
            isActive: workDtl.isActive,
          })),
      })) : [];

      const formData = {
        user_id: user_id! ?? '',
        projectdtl: [
          {
            project_id: project._id,
            role_id: project.role_id ?? roleMap.get(roleName),
            role_name: project.role_name ?? roleName,
            isActive: project.isActive,
            appdtl,
          },
        ],
      };


      setCheckedData((prevState) => ({
        user_id: formData.user_id,
        projectdtl: [
          ...prevState.projectdtl.filter((preProject) => preProject.project_id !== formData.projectdtl[0].project_id),
          ...formData.projectdtl,
        ],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, selectedProject?._id, applications, user_id, workloads]);

  useEffect(() => {
    validCheckedState(storeSelectedProject);
  }, [storeSelectedProject, validCheckedState, selectedProject]);

  //** validateUnCheckedState is use to uncheck evey time the checkbox is clicked based on project level only  */
  const validateUnCheckedState = (project: Project) => {
    setCheckedData((prevState) => {
      const filteredCheckedList = prevState.projectdtl.filter((item) => item.project_id !== project._id);
      return {
        user_id: prevState.user_id,
        projectdtl: filteredCheckedList
      }
    })
  }

  //** set workload based on the workloadData changes */
  useEffect(() => {
    setWorkloads((prevWorkloads: Workload[]) => {
      let updatedWorkLoadData = []
      if (workloadData?.data && workloadData?.data.length > 0) {
        updatedWorkLoadData = workloadData?.data?.map((item: Record<string, unknown>) => {
          return {
            ...item,
          };
        });

      }
      return [...prevWorkloads, ...updatedWorkLoadData];
    });
  }, [workloadData]);

  //** handle workload for every time the the check box is clicked */
  const handleWorkLoad = (event: React.ChangeEvent<HTMLInputElement>, productdetails: {
    project: Project,
    selectedApplication: Application,
    workload: Workload,
  }) => {
    const {
      project,
      selectedApplication,
      workload,
    } = productdetails;

    const roleMap = new Map<string, string>(role?.map(({ role_name, _id }: { role_name: string, _id: string }) => [role_name, _id]));

    if (event?.target?.checked) {
      setWorkloads((prevWorkloads: Workload[]) =>
        prevWorkloads?.map((item) => {
          if (item.app_id === selectedApplication._id &&
            item._id === workload._id) {
            return {
              ...item,
              role_id: roleMap.get(RoleName.WORKLOAD_ADMIN),
              role_name: RoleName.WORKLOAD_ADMIN as string,
              isActive: true,
            }
          } else {
            return {
              ...item,
            }
          }
        }))

      setStoreSelectedProject({
        roleMap,
        roleName: project.role_name!,
      })
    } else {
      setWorkloads((prevWorkloads: Workload[]) => {
        return prevWorkloads?.map((item) => {
          if (item.app_id === selectedApplication._id && item._id === workload._id) {
            return {
              ...item,
              isActive: undefined,
            }
          } else {
            return item
          }
        })
      })
    }
  }

  //** renderWorkLoad is used to render workload based on the application*/
  const renderWorkLoad = (applications: Application[]) => {

    if (
      (workloads?.length === 0 ||
      _.isNil(workloads) ||
      !workloads.find((workload) => workload?.app_id === selectedApplication?._id)) &&
      workloadData?.data.length === 0
    ) {
      return (<TableRow>
        <TableCell
          colSpan={5}
          className="no-data-found">
          No data found
        </TableCell>
      </TableRow>
      )
    }
    

    if (
      !workloads?.length ||
      !selectedApplication ||
      !applications?.length ||
      !selectedProject
    ) {
      return null;
    }

    const project: Project | undefined = projects.find((product) => product._id === selectedProject._id);
    if (!project) {
      return null;
    }

    const isProjectAdmin = project.role_name === RoleName.PROJECT_ADMIN && project.isActive;
    const isViewOnly = project.role_name === RoleName.VIEW_ONLY && project.isActive;

    return workloads.map((workload) => {
      if (workload?.app_id === selectedApplication._id) {
        if (workload.isupdatechecked && (isProjectAdmin || isViewOnly)) {
          workload['isActive'] = false;
        }
        return (
          <TableRow key={workload?._id}>
            <TableCell className="workload-first-td">
              <div className="project-name-list">
                <span>
                  <FrameIcon />
                </span>
                <span>
                  {workload?.workload_name}
                </span>
              </div>
            </TableCell>
            <TableCell colSpan={3} />
            <TableCell>
              <Checkbox
                onChange={(event) =>
                  handleWorkLoad(event, {
                    project,
                    selectedApplication,
                    workload,
                  })
                }
                value={RoleName.WORKLOAD_ADMIN}
                checked={workload.isActive || false}
                disabled={isProjectAdmin || isViewOnly || overViewAccess}
                sx={checkBoxStyle}
              />
            </TableCell>
          </TableRow>
        );
      } 
      return null;
    });

  };

  //** set application based on the appData changes */
  useEffect(() => {
    setApplications((prevApplications) => {
      let updatedAppData = []
      if (appData && appData.length > 0) {
        updatedAppData = appData?.map((item: Record<string, unknown>) => {
          return {
            ...item,
          };
        });

      }
      return [...prevApplications, ...updatedAppData];
    });
  }, [appData]);

  //** handle application for every time the the expand is clicked */
  const handleApplicationClick = (application: Application) => {
    if (expandedApplication && expandedApplication._id === application._id) {
      setExpandedApplication(null);
      setIsApplicationArrowDown(false);
    } else {
      setIsApplicationArrowDown(true);
      setExpandedApplication(application);
      setSelectedApplication((prevApplication: any) => {
        application['isActive'] = true;
        return {
          ...prevApplication,
          ...application
        }
      });
      setApplications((prevApplications: Application[]) =>
        prevApplications?.map((item) =>
          (item._id === application._id) ? {
            ...item,
            isActive: true,
          } : item,
        )
      );
      if (!workloads?.find(({ app_id, project_id }) => (
        project_id === application?.project_id &&
        app_id === application?._id
      ))) {
        const formRequest = {
          data: {
            id: application?._id
          },
          queryparams: `userworkload=true&user_id=${user_id}`
        }

        if (overViewAccess) {
          formRequest.queryparams += `&access_overview=true`
        }

        dispatch(getRoleWorkloadRequest(formRequest as any));
      }
    }
  };

  //** renderApplications is used to render application based on the project */
  const renderApplications = (projects: Project[]) => {
    if (
      (applications?.length === 0 ||
         _.isNil(applications) ||
         !applications.find((app) => app?.project_id === selectedProject?._id)
      ) &&
      appData?.length === 0
    ) {
      return (<TableRow>
        <TableCell
          colSpan={5}
          className="no-data-found">
          No data found
        </TableCell>
      </TableRow>
      )
    }

    if (!projects?.length || !selectedProject || !applications?.length) {
      return null;
    }

    return applications.map((application, index) => {
      if (application?.project_id === selectedProject._id) {
        return (
          <React.Fragment key={application._id}>
            <TableRow
              className={
                isApplicationArrowDown &&
                  selectedApplication?._id === application._id ?
                  'expanded-row' : ''
              }>
              <TableCell className="application-first-td">
                <div className="project-name-list">
                  <span
                    className={
                      isApplicationArrowDown &&
                        selectedApplication?._id === application._id ?
                        'arrow-down-icon custom-cursor application-arrow-icon-position'
                        : 'arrow-right-icon custom-cursor'
                    }
                    onClick={() => handleApplicationClick(application)}>
                    <ArrowRightIcon />
                  </span>
                  {
                    index % 2 === 0 ?
                      <span className="application-icon1"></span> :
                      <span className="application-icon2"></span>
                  }
                  <span>
                    {application?.app_name}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={4} />
            </TableRow>
            {expandedApplication &&
              expandedApplication._id === application._id &&
              renderWorkLoad(applications)}
          </React.Fragment>
        );
      }
      return null
    });
  };

  // API call to Post user management - role mapping */
  const handleSave = () => {

    if (!_.isNil(user_id)) {
      const formRequest: {
        user_id: string | undefined,
        projectdtl: any[],
      } = {
        user_id: userId && project_id ? unMappedUserId : user_id,
        projectdtl: [
          ...finalResult.projectdtl,
          ...updateRemovedProject
        ].sort((a, b) => a.isActive - b.isActive),
      }

      dispatch(getRoleAccessRequest(formRequest))

    } else {
      throw new Error('Cannot read the property of undefine or null (user_id)')
    }
  };

  //** handle handleProjectClick for every time the the expand  is clicked  */
  const handleProjectClick = async (project: Project) => {
    if (expandedProject && expandedProject._id === project._id) {
      setExpandedProject(null);
      setSelectedApplication(null)
      setIsProjectArrowDown(false)
    } else {
      setIsProjectArrowDown(true)
      setExpandedProject(project);
      setSelectedProject(project);
      if (!applications.find(({ project_id }) => project_id === project._id)) {
        const formRequest: any = {
          project_id: project._id,
          role_name: project?.role_name,
        }
        dispatch(getRoleAppRequest(formRequest));
      }
    }
  };

  //** handle handleProject for every time the the check box is clicked */
  const handleProject = (event: React.ChangeEvent<HTMLInputElement>, project: Project) => {
    const roleName = event?.target?.value;
    const roleMap = new Map<string, string>(role?.map(({ role_name, _id }: { role_name: string, _id: string }) => [role_name, _id]));

    // ** Update scenario to find the check project */
    const isUpdatedProduct = projectData?.data?.projectDtl.find(
      (item: Record<string, any>) => (item._id === project._id && item.hasOwnProperty('roledtl') && roleName === item?.roledtl?.role_name));

    if (event?.target?.checked) {
      setProjects((prevProjects: Project[]) =>
        prevProjects?.map((item) =>
          item._id === project._id ? {
            ...item,
            isActive: true,
            role_id: roleMap.get(roleName),
            role_name: roleName,
            ...(isUpdatedProduct && {
              isupdatechecked: true   //** Update scenario */
            }),
          } : item,
        )
      );

      setSelectedProject(() => {
        return {
          ...project,
          isActive: true,
          role_id: roleMap.get(roleName),
          role_name: roleName,
          ...(isUpdatedProduct && {
            isupdatechecked: true  //** Update scenario */
          }),
        }
      });

      validCheckedState({
        roleName,
      });

    } else {
      setProjects((prevProjects: Project[]) =>
        prevProjects?.map((item) =>
          item._id === project._id ? {
            ...item,
            isActive: undefined,
            ...(isUpdatedProduct && {
              isupdatechecked: true   //** Update scenario */
            }),
            role_id: roleMap.get(roleName),
            role_name: roleName,
          } : item
        )
      );
      validateUnCheckedState(project)
    }
  };

  return (
    <>
      <CustomBackdrop open={
        projectLoading ||
        appLoading ||
        workloadLoading ||
        roleLoading ||
        getroleaccess} />
      <TableContainer>
        <Table className="table-container">
          <TableHead>
            <TableRow>
              <TableCell>
                Project Structure
              </TableCell>
              <TableCell>Project Admin</TableCell>
              <TableCell>Infra Admin</TableCell>
              <TableCell>View Only</TableCell>
              <TableCell>Workload Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects &&
              projects?.map((project: any) => (
                <React.Fragment key={project._id}>
                  <TableRow>
                    <TableCell>
                      <div className="project-name-list">
                        <span
                          className={
                            isProjectArrowDown &&
                              selectedProject?._id === project._id ?
                              'arrow-down-icon custom-cursor' : 'arrow-right-icon custom-cursor'
                          }
                          onClick={() => handleProjectClick(project)}>
                          <ArrowRightIcon />
                        </span>
                        <span>
                          <FileFolderIcon />
                        </span>
                        <span>
                          {project?.project_name ?? project?.project.name}
                        </span>
                      </div>
                    </TableCell>
                    {
                      !workloads?.some(({
                        project_id, isActive
                      }) => project_id === project._id && isActive) ? (
                        <TableCell>
                          <Checkbox
                            checked={
                              (project?.isActive &&
                                project?.role_name === RoleName.PROJECT_ADMIN) || false}
                            value={RoleName.PROJECT_ADMIN}
                            onChange={(event) => handleProject(event, project)}
                            disabled={((project.isActive && (project.role_name === RoleName.VIEW_ONLY
                              || project.role_name === RoleName.INFRA_ADMIN)) || overViewAccess)}
                            sx={checkBoxStyle}
                          />
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Checkbox
                            value={RoleName.PROJECT_ADMIN}
                            disabled={true}
                            sx={checkBoxStyle}
                          />
                        </TableCell>
                      )
                    }
                    <TableCell>
                      <Checkbox
                        checked={
                          (project?.isActive &&
                            project?.role_name === RoleName.INFRA_ADMIN) || false
                        }
                        value={RoleName.INFRA_ADMIN}
                        onChange={(event) => handleProject(event, project)}
                        disabled={
                          ((project.isActive &&
                          (project.role_name === RoleName.PROJECT_ADMIN ||
                            project.role_name === RoleName.VIEW_ONLY)) || overViewAccess)
                        }
                        sx={checkBoxStyle}
                      />
                    </TableCell>
                    {!workloads?.some(({
                      project_id, isActive
                    }) => project_id === project._id && isActive) ? (
                      <TableCell>
                        <Checkbox
                          checked={
                            (project?.isActive &&
                              project?.role_name === RoleName.VIEW_ONLY) || false
                          }
                          value={RoleName.VIEW_ONLY}
                          onChange={(event) => handleProject(event, project)}
                          disabled={
                            ((project.isActive &&
                            (project.role_name === RoleName.PROJECT_ADMIN ||
                              project.role_name === RoleName.INFRA_ADMIN))|| overViewAccess)
                          }
                          sx={checkBoxStyle}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Checkbox
                          value={RoleName.VIEW_ONLY}
                          disabled={true}
                          sx={checkBoxStyle}
                        />
                      </TableCell>
                    )}
                    <TableCell>{/* Render workload admin here */}</TableCell>
                  </TableRow>

                  {expandedProject &&
                    expandedProject._id === project._id &&
                    renderApplications(projects)}
                </React.Fragment>
              ))}
            {(_.isNil(projects) || projects?.length === 0) &&
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="no-data-found">
                  {
                    (projectData?.data?.projectDtl?.length === 0) &&
                    'No data found'
                  }
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
        {userId && project_id && !overViewAccess ? (
          <Button
            disableRipple={true}
            className={
              (finalResult?.projectdtl?.length === 0 &&
                updateRemovedProject?.length === 0) ||
                (projectData?.data?.projectDtl?.length === 0 ||
                _.isNil(projectData?.data?.projectDtl)) ?
              "submit-btn action-disabled" : "submit-btn"
            }
            disabled={
              (finalResult?.projectdtl?.length === 0 &&
              updateRemovedProject?.length === 0) ||
              (projectData?.data?.projectDtl?.length === 0 ||
              _.isNil(projectData?.data?.projectDtl))
            }
            type="submit"
            onClick={() => {
              if (handleUserSelect) {
                const userSelected = handleUserSelect(false)
                if (userSelected) {
                  handleSave()
                }
              }
            }}
          >
            {action}
          </Button>
        ) : !overViewAccess ? (
          <Button
            disableRipple={true}
            disabled={
              (finalResult?.projectdtl?.length === 0 &&
                updateRemovedProject?.length === 0) ||
                (projectData?.data?.projectDtl?.length === 0 ||
                _.isNil(projectData?.data?.projectDtl))
            }
            className={
              (finalResult?.projectdtl?.length === 0 &&
                updateRemovedProject?.length === 0) ||
                (projectData?.data?.projectDtl?.length === 0 ||
                _.isNil(projectData?.data?.projectDtl)) ?
              "save-button action-disabled" : "save-button"
            }
            type="submit"
            onClick={handleSave}
          >
            Save
          </Button>
        ) : ''
        }
      </TableContainer>
      <MySnackbar
        className="snack-bar"
        message={message}
        severity={severity}
        open={open}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default RoleMappingContactApiProvider;
