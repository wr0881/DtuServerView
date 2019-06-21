/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-useless-return */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import {Card, Table, Divider, Popconfirm, message, Input, Switch} from 'antd';
import isEqual from 'lodash/isEqual';


class TestTable extends React.Component{
    index = 0;

    cachOriginData = {};

    constructor(props){
        super(props);

        this.state = {
            data: props.value,
            loading: false,
            value: props.value,
        }
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if(isEqual(nextProps.value, preState.value)) {
            return null;
        }
        return {
            data: nextProps.value,
            value: nextProps.value,
        }
    }

    componentDidMount() {
        // 构造一些初始数据
        const data = [
            {
                id: 1,
                name: 'student1',
                sex: '男',
                age: 12,
                state: '已启用'
            },
            {
                id: 2,
                name: 'student2',
                sex: '女',
                age: 12,
                state: '未启用'
            },
            {
                id: 3,
                name: 'student3',
                sex: '女',
                age: 12,
                state: '已启用'
            }
        ];

        this.setState({
        dataSource : data
        })
        // this.props.onDidMount();
    }
    
    // 获取每行数据并过滤
    getRowByKey(key, newData){
        const { data } = this.state;
        return (newData || data).filter(item => item.key === key)[0];
    }
    
    // 切换至可编辑状态
    toggleEditable = (e, key) => {
        e.preventDefault();
        const { data } = this.state;
        console.log(this.state.data);
        const newData = data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if(target){
            // 编辑状态时保存原始数据
            if(!target.editable) {
                this.cachOriginData[key] = { ...target };
            }
            target.editable = !target.editable;
            this.setState({ data: newData });
        }
    }
    
    // 添加成员
    newMember = () => {
        const { data } = this.state;
        const newData = data.map(item => ({ ...item }));
        newData.push({
            key: `NEW_TEMP_ID_${this.index}`,
            workId: '',
            name: '',
            department: '',
            editable: true,
            isNew: true,
        });
        this.index += 1;
        this.setState({ data: newData });
    }
    
    // 删除
    remove(key) {
        const { data } = this.state;
        const { onchange } = this.props;
        const newData = data.filter(item => item.key !== key);
        this.setState({ data: newData });
        onchange(newData);
    }

    handleKeyPress(e, key) {
        if(e.key === 'Enter') {
            this.saveRow(e, key);
        }
    }

    handleFieldChange(e,fieldName,key) {
        const { data } = this.state;
        const newData = data.map(item => ({ ...item}));
        const target = this.getRowByKey(key, newData);
        if(target) {
            target[fieldName] = e.target.value;
            this.setState({ data: newData });
        }
    }
    
    // 保存 行
    saveRow(e, key) {
        e.persist();
        this.setState({
            loading:true,
        });
        setTimeout(() => {
            if(this.clickedCancel) {
                this.clickedCancel = false;
                return;
            }
            const target = this.getRowByKey(key) || {};
            if(!target.workId || !target.name || !target.department){
                message.error("请填写相关信息！");
                e.target.focus();
                this.setState({
                    loading: false,
                });
                return;
            }
            delete target.isNew;// 清除状态
            this.toggleEditable(e, key);
            const { data } = this.state;
            const { onChange } = this.props;
            onChange(data);
            this.setState({
                loading: false,
            });
        },500);
    }

    // 注销
    cancel(e, key) {
        this.clickedCancel = true;
        e.preventDefault();
        const { data } = this.state;
        const newData = data.map(item => ({ ...item}));
        const target = this.getRowByKey(key, newData);
        if(this.cachOriginData[key]){
            Object.assign(target, this.cachOriginData[key]);
            delete this.cachOriginData[key];
        }
        target.editable = false;
        this.setState({ data: newData });
        this.clickedCancel = false;
    }
    
    render() {

        // 定义表头，一般放在render()中
        const columns = [
            {
                title: '编号',         
                dataIndex: 'id',      
                key: 'name',
                render: (text, record) => {
                    if(record.editable) {
                        return (
                            <Input 
                                value={text}
                                autoFocus
                                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder='编号'
                            />
                        );
                    }
                    return text;
                }
                
            },
            {
                title:'姓名',
                dataIndex:'name',
                key: 'name',
                render: (text, record) => {
                    if(record.editable) {
                        return (
                            <Input 
                                value={text}
                                autoFocus
                                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder='姓名'
                            />
                        );
                    }
                    return text;
                }
            },
            {
                title:'性别',
                dataIndex:'sex',
                key: 'sex',
                render: (text, record) => {
                    if(record.editable) {
                        return (
                            <Input 
                                value={text}
                                autoFocus
                                onChange={e => this.handleFieldChange(e, 'sex', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder='性别'
                            />
                        );
                    }
                    return text;
                }
            },
            {
                title:'年龄',
                dataIndex:'age',
                key: 'age',
                render: (text, record) => {
                    if(record.editable) {
                        return (
                            <Input 
                                value={text}
                                autoFocus
                                onChange={e => this.handleFieldChange(e, 'age', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder='年龄'
                            />
                        );
                    }
                    return text;
                }
            },
            {
                title:'启用状态',
                dataIndex:'state',
                key: 'state',
                render: (text, record) => {
                    const checked = text === '已启用' ? true : false;
                    return (
                        <Switch 
                            checkedChildren='已启用'
                            unCheckedChildren='未启用'
                            checked={checked}
                            onChange={e => {
                                const inAndOutStatus = e ? '已启用' : '未启用';
                                updateInAndOut({ state }).then(res => {
                                    if(res){
                                        this.queryDataSource(false);
                                    }
                                })
                            }}
                        />
                    )
                    // if(record.editable) {
                    //     return (
                    //         <Input 
                    //             value={text}
                    //             autoFocus
                    //             onChange={e => this.handleFieldChange(e, 'state', record.key)}
                    //             onKeyPress={e => this.handleKeyPress(e, record.key)}
                    //             placeholder='启用状态'
                    //         />
                    //     );
                    // }
                    // return text;
                }
            },
            {
                title:'操作',
                dataIndex:'action',
                render: (text, record) => {
                    const { loading } = this.state;
                    if(!!record.editable && loading){
                        return null;
                    }
                    if(record.editable){
                        if(record.isNew){
                            return(
                                <span>
                                    <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                                    <Divider type="vertical" />
                                    <Popconfirm title="是否删除此行？" onConfirm={() => this.remove(record.key)}>
                                        <a>删除</a>
                                    </Popconfirm>
                                </span>
                            );
                        }
                        return(
                            <span>
                                <a>保存</a>
                                <Divider type="vertical" />
                                <a>取消</a>
                            </span>
                        )
                    }
                    return (
                        <span>
                            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a> 
                            <Divider type="vertical" />
                            <Popconfirm title="是否删除此行？" onConfirm={() => this.remove(record.key)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    );
                }                
            }
        ];
        
        const { loading, data } = this.state;

        return (
            <Card>
                <Table 
                    columns={columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    
                />
            </Card>
            // <div>
            //     <Card title="基础表格">
            //     {/* columns:指定表头
            //     dataSource:指定数据源
            //     borderd:加边框 */}
            //     <Table columns={columns} dataSource={this.state.dataSource} bordered />
            //     </Card>
            // </div>
        )
    }

}

export default TestTable;
