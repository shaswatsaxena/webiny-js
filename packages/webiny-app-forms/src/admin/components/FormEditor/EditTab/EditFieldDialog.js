// @flow
import React, { useState, useEffect, useCallback, Fragment } from "react";
import { cloneDeep } from "lodash";
import { css } from "emotion";
import {
    Dialog,
    DialogBody,
    DialogHeader,
    DialogHeaderTitle,
    DialogCancel,
    DialogFooter,
    DialogFooterButton
} from "webiny-ui/Dialog";

import { Form } from "webiny-form";
import { getPlugins } from "webiny-plugins";
import { Tabs, Tab } from "webiny-ui/Tabs";
import { Elevation } from "webiny-ui/Elevation";
import { Typography } from "webiny-ui/Typography";
import { Icon } from "webiny-ui/Icon";
import GeneralTab from "./GeneralTab";
import ValidatorsTab from "./ValidatorsTab";
import { useFormEditor } from "webiny-app-forms/admin/components/FormEditor/Context";

import { i18n } from "webiny-app/i18n";
const t = i18n.namespace("FormEditor.EditFieldDialog");

const dialogBody = css({
    "&.mdc-dialog__body": {
        marginTop: 0,
        padding: "24px 0 0 0"
    }
});

function getFieldType() {
    const plugin = editField
        ? getPlugins("form-editor-field-type").find(pl => pl.fieldType.id === editField.type)
        : null;

    return plugin ? plugin.fieldType : null;
}

const Thumbnail = ({ fieldType, onClick }) => {
    return (
        <Elevation z={2} onClick={onClick}>
            <Icon icon={fieldType.icon} />
            <Typography use={"headline5"}>{fieldType.label}</Typography>
            <Typography use={"caption"}>{fieldType.description}</Typography>
        </Elevation>
    );
};

type Props = {
    field: ?Object,
    onClose: Function,
    onSubmit: Function
};

const EditFieldDialog = ({ field, onSubmit, ...props }: Props) => {
    // const fieldType = getFieldType();
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        setCurrent(cloneDeep(field));
    }, [field]);

    const onClose = useCallback(() => {
        setCurrent(null);
        props.onClose();
    });

    return (
        <Dialog open={!!current} onClose={onClose}>
            <DialogHeader>
                <DialogHeaderTitle>{t`Field Settings`}</DialogHeaderTitle>
            </DialogHeader>

            {current &&
                (current.type ? (
                    <Form submitOnEnter data={current} onSubmit={onSubmit}>
                        {form => (
                            <Fragment>
                                <DialogBody className={dialogBody}>
                                    <Tabs>
                                        <Tab label={t`General`}>
                                            <GeneralTab form={form} field={current} />
                                        </Tab>
                                        <Tab label={"Validators"}>
                                            {/*<Bind name={"validation"}>
                                                <ValidatorsTab formProps={formProps} field={current} />
                                            </Bind>*/}
                                        </Tab>
                                    </Tabs>
                                </DialogBody>
                                <DialogFooter>
                                    <DialogFooterButton onClick={onClose}>
                                        {t`Cancel`}
                                    </DialogFooterButton>
                                    <DialogFooterButton onClick={form.submit}>
                                        {t`Save`}
                                    </DialogFooterButton>
                                </DialogFooter>
                            </Fragment>
                        )}
                    </Form>
                ) : (
                    <>
                        <DialogBody className={dialogBody}>
                            {getPlugins("form-editor-field-type")
                                .filter(pl => pl.fieldType.dataType)
                                .map(pl => (
                                    <Thumbnail
                                        key={pl.name}
                                        fieldType={pl.fieldType}
                                        onClick={() => setCurrent(pl.fieldType.createField())}
                                    />
                                ))}
                        </DialogBody>
                        <DialogFooter>
                            <DialogCancel onClick={onClose}>{t`Cancel`}</DialogCancel>
                        </DialogFooter>
                    </>
                ))}
        </Dialog>
    );
};

export default EditFieldDialog;
